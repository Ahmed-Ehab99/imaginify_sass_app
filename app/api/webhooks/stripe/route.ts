import { createTransaction } from "@/lib/actions/transaction.action";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!sig) {
      console.error("❌ Missing stripe-signature header");
      return NextResponse.json(
        { message: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (!endpointSecret) {
      console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
      throw new Error(
        "Please add STRIPE_WEBHOOK_SECRET from Stripe Dashboard to .env or .env.local"
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Webhook signature verification failed:", errorMessage);
      console.error("❌ Signature verification error details:", err);
      return NextResponse.json(
        {
          message: "Webhook signature verification failed",
          error: errorMessage,
        },
        { status: 400 }
      );
    }

    const eventType = event.type;

    if (eventType === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return NextResponse.json({
          message: "Payment not completed",
          payment_status: session.payment_status,
        });
      }

      if (!session.metadata?.buyerId) {
        return NextResponse.json(
          { message: "Missing buyerId in metadata" },
          { status: 400 }
        );
      }

      try {
        new Types.ObjectId(session.metadata.buyerId);
      } catch {
        console.error(
          "❌ Invalid ObjectId format for buyerId:",
          session.metadata.buyerId
        );
        return NextResponse.json(
          { message: "Invalid buyerId format" },
          { status: 400 }
        );
      }

      const transaction = {
        stripeId: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        plan: session.metadata?.plan || "",
        credits: Number(session.metadata?.credits) || 0,
        buyerId: session.metadata?.buyerId,
        createdAt: new Date(),
      };

      try {
        const newTransaction = await createTransaction(transaction);
        return NextResponse.json({
          message: "OK",
          transaction: newTransaction,
        });
      } catch (error) {
        console.error("❌ Error creating transaction:", error);
        return NextResponse.json(
          {
            message: "Failed to create transaction",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    // For unhandled event types
    return NextResponse.json({ message: "Event received", type: eventType });
  } catch (error) {
    console.error("❌ Unexpected error in webhook:", error);
    return NextResponse.json(
      {
        message: "Webhook processing failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
