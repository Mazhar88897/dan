import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const EXPRESS_UPDATE_KYC_URL =
  process.env.EXPRESS_UPDATE_KYC_URL ?? "https://your-express-api/update-kyc";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook signature invalid" },
      { status: 400 }
    );
  }

  if (event.type === "identity.verification_session.verified") {
    const session = event.data.object as Stripe.Identity.VerificationSession;
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        await fetch(EXPRESS_UPDATE_KYC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status: "verified" }),
        });
      } catch (err) {
        console.error("[Stripe webhook] Failed to notify Express:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
