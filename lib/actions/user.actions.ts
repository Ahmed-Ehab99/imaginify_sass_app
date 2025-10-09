"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    // Use findOneAndUpdate with upsert to handle duplicate users
    const newUser = await User.findOneAndUpdate(
      { clerkId: user.clerkId },
      user,
      {
        new: true,
        upsert: true,
      }
    );

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // If user doesn't exist, create them using Clerk data
      const { createClerkClient } = await import("@clerk/backend");
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      const clerkUser = await clerk.users.getUser(userId);

      if (clerkUser) {
        const userPayload = {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          username: clerkUser.username ?? "",
          firstName: clerkUser.firstName ?? "",
          lastName: clerkUser.lastName ?? "",
          photo: clerkUser.imageUrl ?? "",
        };

        user = await createUser(userPayload);
      } else {
        throw new Error("User not found in Clerk");
      }
    }

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

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}
