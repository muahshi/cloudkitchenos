import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  let body: VerifyBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing required payment fields" },
      { status: 400 }
    );
  }

  // ── Verify HMAC signature ─────────────────────────────────────────────────
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.warn("Payment signature mismatch for user:", user.id);
    return NextResponse.json(
      { error: "Payment verification failed. Signature mismatch." },
      { status: 400 }
    );
  }

  // ── Activate PRO subscription in DB ──────────────────────────────────────
  try {
    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          status: "active" as const,
          plan: "pro" as const,
          amount_paid: 1499,
          currency: "INR",
          payment_id: razorpay_payment_id,
          expires_at: null as string | null,
        },
        { onConflict: "payment_id" }
      );

    if (subError) throw subError;

    // Also update profile is_pro flag
    await supabaseAdmin
      .from("profiles")
      .update({ is_pro: true })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      message: "PRO access activated successfully.",
    });
  } catch (err) {
    console.error("Subscription activation error:", err);
    return NextResponse.json(
      { error: "Payment verified but subscription activation failed. Please contact support." },
      { status: 500 }
    );
  }
}
