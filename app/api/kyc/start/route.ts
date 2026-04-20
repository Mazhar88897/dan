import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId ?? "anonymous";

    const session = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: { userId: String(userId) },
      options: {
        document: {
          // Require selfie and match face to ID photo — ensures the person taking verification is the same as on the ID
          require_matching_selfie: true,
          // Require camera capture (no uploads) for document — reduces fraud
          require_live_capture: true,
        },
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("[KYC start]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start KYC" },
      { status: 500 }
    );
  }
}
