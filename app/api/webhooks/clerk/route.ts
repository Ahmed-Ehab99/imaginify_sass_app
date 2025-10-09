/* eslint-disable @typescript-eslint/no-explicit-any */

import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";

import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";
import { connectToDatabase } from "@/lib/database/mongoose"; // your DB helper

// create a clerk client for server-side metadata updates
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});


export async function POST(req: NextRequest) {
  try {
    // Verify the webhook (will throw on invalid signature)
    // verifyWebhook returns the typed event object
    const evt = await verifyWebhook(req, {
      // optional: you can pass signingSecret here to override env lookup:
      signingSecret: process.env.WEBHOOK_SECRET
    });

    // Ensure DB connected before doing anything that touches your DB
    // (connectToDatabase should be the function you use to connect once and reuse)
    await connectToDatabase();

    const eventType = evt.type;
    // evt.data shape varies by event; treat defensively
    const data: any = evt.data;

    // --- user.created ---
    if (eventType === "user.created") {
      const {
        id: clerkId,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = data;

      // Map Clerk event payload to your DB user shape
      const userPayload = {
        clerkId,
        email: email_addresses?.[0]?.email_address ?? "",
        username: username ?? "",
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        photo: image_url ?? "",
      };

      // createUser should be idempotent or use upsert internally
      const newUser = await createUser(userPayload);

      // If you created a DB user, attach your DB id to the Clerk user metadata
      if (newUser) {
        // updateUserMetadata merges metadata (server SDK)
        await clerk.users.updateUserMetadata(clerkId, {
          publicMetadata: { userId: newUser._id.toString() },
        });
      }

      return NextResponse.json({ message: "user.created handled" });
    }

    // --- user.updated ---
    if (eventType === "user.updated") {
      const { id: clerkId, image_url, first_name, last_name, username } = data;

      const userPayload = {
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        username: username ?? "",
        photo: image_url ?? "",
      };

      const updatedUser = await updateUser(clerkId, userPayload);

      return NextResponse.json({
        message: "user.updated handled",
        user: updatedUser,
      });
    }

    // --- user.deleted ---
    if (eventType === "user.deleted") {
      const { id: clerkId } = data;

      const deletedUser = await deleteUser(clerkId);

      return NextResponse.json({
        message: "user.deleted handled",
        user: deletedUser,
      });
    }

    // Unhandled events: acknowledge so Clerk won't keep retrying
    console.log("Unhandled Clerk event:", eventType, data);
    return new Response("", { status: 200 });
  } catch (err: any) {
    console.error("Webhook verification / processing error:", err);
    // Return 400 so Clerk knows the delivery failed (or 500 for server error)
    return new Response("Error processing webhook", { status: 400 });
  }
}
