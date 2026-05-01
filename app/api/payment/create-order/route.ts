import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── Razorpay types (install razorpay package in prod) ─────────────────────────
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

const PRO_PRICE_INR = 149900; // ₹1,499 in paise
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// ── POST /api/payment/create-order ────────────────────────────────────────────
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

  // Check for existing active subscription
  const { data: existingSub } = await supabaseAdmin
    .from("subscriptions")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (existingSub) {
    return NextResponse.json(
      { error: "You already have an active PRO subscription." },
      { status: 409 }
    );
  }

  // Create Razorpay order via their REST API
  try {
    const credentials = Buffer.from(
      `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: PRO_PRICE_INR,
        currency: "INR",
        receipt: `ckos_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          user_id: user.id,
          email: user.email,
          plan: "pro",
        },
      }),
    });

    if (!razorpayRes.ok) {
      const errBody = await razorpayRes.text();
      console.error("Razorpay error:", errBody);
      throw new Error("Failed to create payment order");
    }

    const order: RazorpayOrder = await razorpayRes.json();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      prefill: {
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Payment create-order error:", err);
    return NextResponse.json(
      { error: "Failed to initialize payment. Please try again." },
      { status: 500 }
    );
  }
}

// ── POST /api/payment/verify ──────────────────────────────────────────────────
// Separate route handles Razorpay webhook/verification + subscription creation
// See: /api/payment/verify/route.ts
