import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// ── Local admin client (no generic = no type conflict) ────────────────────────
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(req: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // ── Parse body ───────────────────────────────────────────────────────────
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

  // ── Verify HMAC signature ────────────────────────────────────────────────
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

  // ── Activate PRO subscription ────────────────────────────────────────────
  try {
    // Delete existing subscription for this user first (avoid conflict)
    await admin
      .from("subscriptions")
      .delete()
      .eq("user_id", user.id);

    // Insert fresh active subscription
    const { error: subError } = await admin
      .from("subscriptions")
      .insert({
        user_id: user.id,
        status: "active",
        plan: "pro",
        amount_paid: 1499,
        currency: "INR",
        payment_id: razorpay_payment_id,
        expires_at: null,
      });

    if (subError) throw subError;

    // Update profile is_pro flag
    await admin
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
      { error: "Payment verified but activation failed. Contact support." },
      { status: 500 }
    );
  }
}

