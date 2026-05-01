import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { AnalyzeApiRequest, AnalyzeApiResponse, FeasibilityResult } from "@/types/database";

// ── Rate limiting (simple in-memory, replace with Redis in prod) ─────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// ── Groq Client ──────────────────────────────────────────────────────────────
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// ── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are CloudKitchenOS — an elite cloud kitchen business analyst for the Indian market with deep expertise in food-tech, FSSAI regulations, Swiggy/Zomato platform dynamics, and regional cuisine economics.

Your task: Analyze cloud kitchen feasibility and return a STRICT JSON response.

RULES:
1. Return ONLY valid JSON — no markdown, no backticks, no preamble.
2. All monetary values in INR (₹).
3. Be specific to Indian market conditions, city tiers, and food delivery economics.
4. feasibilityScore must be an integer 0–100.
5. verdict must be exactly one of: "Highly Feasible", "Feasible", "Risky", "Not Recommended"

JSON SCHEMA (return exactly this structure):
{
  "feasibilityScore": <number 0-100>,
  "verdict": "<string>",
  "summary": "<2-3 sentence executive summary>",
  "swot": {
    "strengths": ["<string>", ...],
    "weaknesses": ["<string>", ...],
    "opportunities": ["<string>", ...],
    "threats": ["<string>", ...]
  },
  "roadmap": [
    {
      "phase": 1,
      "title": "<string>",
      "duration": "<string>",
      "tasks": ["<string>", ...],
      "estimatedCost": "<string>",
      "milestone": "<string>"
    }
  ],
  "estimatedMonthlyRevenue": "<string>",
  "estimatedBreakeven": "<string>",
  "keyRisks": ["<string>", ...],
  "quickWins": ["<string>", ...]
}`;

function buildUserPrompt(input: AnalyzeApiRequest["input"]): string {
  return `Analyze this cloud kitchen opportunity:

📍 Location: ${input.location}
💰 Budget: ₹${input.budget.toLocaleString("en-IN")}
🏭 Kitchen Type: ${input.kitchenType.replace(/_/g, " ")}
🍽️ Cuisine: ${input.cuisine}
${input.targetCustomers ? `👥 Target Customers: ${input.targetCustomers}` : ""}
${input.operatingHours ? `⏰ Operating Hours: ${input.operatingHours}` : ""}

Provide a comprehensive feasibility analysis. Include:
- Realistic revenue projections based on average order value and delivery platform commission (25–30%)
- FSSAI registration cost and timeline for this kitchen type
- Location-specific competition analysis
- Swiggy/Zomato listing strategy
- 4-phase roadmap from setup to profitability
- Break-even timeline considering Indian market dynamics

Be brutally honest. If the budget is insufficient, say so clearly.`;
}

// ── Main Route Handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit check
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  // Parse body
  let body: AnalyzeApiRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { input } = body;

  // Validate required fields
  if (!input?.location || !input?.budget || !input?.kitchenType || !input?.cuisine) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: location, budget, kitchenType, cuisine." },
      { status: 400 }
    );
  }

  if (input.budget < 10000 || input.budget > 50000000) {
    return NextResponse.json(
      { success: false, error: "Budget must be between ₹10,000 and ₹5,00,00,000." },
      { status: 400 }
    );
  }

  // Call Groq
  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0]?.message?.content ?? "";

    // Parse JSON
    let parsed: FeasibilityResult;
    try {
      parsed = JSON.parse(rawText) as FeasibilityResult;
    } catch {
      console.error("Groq JSON parse error. Raw:", rawText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "AI returned malformed response. Please retry." },
        { status: 502 }
      );
    }

    // Validate score
    if (
      typeof parsed.feasibilityScore !== "number" ||
      parsed.feasibilityScore < 0 ||
      parsed.feasibilityScore > 100
    ) {
      parsed.feasibilityScore = 50;
    }

    const response: AnalyzeApiResponse = {
      success: true,
      data: parsed,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Groq API error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error from AI service.";
    return NextResponse.json(
      { success: false, error: `AI analysis failed: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "CloudKitchenOS Analyze API v1.0 — POST only." },
    { status: 200 }
  );
}
