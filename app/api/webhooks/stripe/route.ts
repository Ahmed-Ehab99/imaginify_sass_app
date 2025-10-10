import { createTransaction } from "@/lib/actions/transaction.action";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(request: Request) {
  try {
    console.log("🔵 Webhook received at:", new Date().toISOString());

    const body = await request.text();
    console.log("🔵 Webhook body length:", body.length);

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
      console.log("✅ Webhook signature verified");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Webhook signature verification failed:", errorMessage);
      return NextResponse.json(
        { message: "Webhook error", error: errorMessage },
        { status: 400 }
      );
    }

    // Get the type
    const eventType = event.type;
    console.log("🔵 Event type:", eventType);

    // Handle checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("🔵 Checkout session completed:", {
        id: session.id,
        amount_total: session.amount_total,
        metadata: session.metadata,
        payment_status: session.payment_status,
      });

      if (!session.metadata?.buyerId) {
        console.error("❌ Missing buyerId in session metadata");
        return NextResponse.json(
          { message: "Missing buyerId in metadata" },
          { status: 400 }
        );
      }

      const transaction = {
        stripeId: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        plan: session.metadata?.plan || "",
        credits: Number(session.metadata?.credits) || 0,
        buyerId: session.metadata?.buyerId, // This is MongoDB _id
        createdAt: new Date(),
      };

      console.log("🔵 Creating transaction with data:", transaction);

      try {
        const newTransaction = await createTransaction(transaction);
        console.log("✅ Transaction created successfully:", newTransaction);
        return NextResponse.json({
          message: "OK",
          transaction: newTransaction,
        });
      } catch (error) {
        console.error("❌ Error creating transaction:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.stack : error
        );
        return NextResponse.json(
          {
            message: "Failed to create transaction",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    console.log("🔵 Unhandled event type:", eventType);
    // Return 200 for unhandled event types
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
