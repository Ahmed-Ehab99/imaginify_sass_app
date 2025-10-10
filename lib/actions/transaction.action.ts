"use server";

import { Types } from "mongoose";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import Transaction from "../database/models/transaction.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { updateCredits } from "./user.actions";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const amount = Number(transaction.amount) * 100;

    if (!transaction.buyerId) {
      throw new Error("Missing buyerId");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: transaction.plan,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: transaction.plan,
        credits: transaction.credits.toString(), // Stripe metadata must be strings
        buyerId: transaction.buyerId, // Already MongoDB _id from Credits page
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/credits?canceled=true`,
    });

    redirect(session.url!);
  } catch (error) {
    // Ignore NEXT_REDIRECT errors as they are normal for redirect() function
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw redirect errors without logging
    }
    console.error("❌ Error in checkoutCredits:", error);
    throw error;
  }
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // Validate required fields
    if (!transaction.stripeId) {
      throw new Error("Missing stripeId in transaction data");
    }
    if (!transaction.buyerId) {
      throw new Error("Missing buyerId in transaction data");
    }

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      stripeId: transaction.stripeId,
      amount: transaction.amount,
      plan: transaction.plan,
      credits: transaction.credits,
      buyer: new Types.ObjectId(transaction.buyerId), // Convert string to ObjectId
      createdAt: transaction.createdAt || new Date(),
    });

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    console.error("❌ Error in createTransaction:", error);
    handleError(error);
    throw error;
  }
}
