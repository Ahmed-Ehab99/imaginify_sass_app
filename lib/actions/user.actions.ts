"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

/** When webhooks are unavailable (e.g. local dev), create the DB user from Clerk. */
async function syncUserFromClerk(clerkId: string) {
  const client = await clerkClient();
  const cu = await client.users.getUser(clerkId);

  const email =
    cu.emailAddresses.find((e) => e.id === cu.primaryEmailAddressId)
      ?.emailAddress ?? cu.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User has no email address");
  }

  const username =
    (cu.username && cu.username.trim()) ||
    `${email.split("@")[0]}_${clerkId.slice(-8)}`;

  const params: CreateUserParams = {
    clerkId,
    email,
    username,
    firstName: cu.firstName ?? "",
    lastName: cu.lastName ?? "",
    photo: cu.imageUrl ?? "",
  };

  await connectToDatabase();

  try {
    const doc = await User.create(params);
    const newUser = JSON.parse(JSON.stringify(doc));
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        userId: newUser._id,
      },
    });
  } catch (err: unknown) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? (err as { code?: number }).code
        : undefined;
    if (code !== 11000) handleError(err);
    // E11000: race with webhook or parallel request — row already exists
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      await syncUserFromClerk(userId);
      user = await User.findOne({ clerkId: userId });
    }

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if (!updatedUserCredits) {
      const error = new Error("User credits update failed");
      console.error("❌ Update credits error:", error);
      throw error;
    }

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    console.error("❌ Error in updateCredits:", error);
    handleError(error);
    throw error;
  }
}
