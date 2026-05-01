// ── Supabase Database Types + Domain Models ─────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Raw DB Schema ────────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      kitchens: {
        Row: {
          id: string;
          user_id: string;
          location: string;
          budget: number;
          kitchen_type: KitchenType;
          cuisine: string;
          feasibility_score: number;
          swot: Json;
          roadmap: Json;
          raw_response: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["kitchens"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["kitchens"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: "active" | "expired" | "cancelled";
          plan: "free" | "pro";
          amount_paid: number;
          currency: string;
          payment_id: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["subscriptions"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          city: string | null;
          is_pro: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      kitchen_type: KitchenType;
      subscription_status: "active" | "expired" | "cancelled";
    };
  };
}

// ── Domain Models ────────────────────────────────────────────────────────────
export type KitchenType =
  | "ghost_kitchen"
  | "shared_kitchen"
  | "home_kitchen"
  | "cloud_kitchen_franchise";

export interface FeasibilityInput {
  location: string;
  budget: number;
  kitchenType: KitchenType;
  cuisine: string;
  targetCustomers?: string;
  operatingHours?: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  tasks: string[];
  estimatedCost: string;
  milestone: string;
}

export interface FeasibilityResult {
  feasibilityScore: number; // 0–100
  verdict: "Highly Feasible" | "Feasible" | "Risky" | "Not Recommended";
  summary: string;
  swot: SwotAnalysis;
  roadmap: RoadmapPhase[];
  estimatedMonthlyRevenue: string;
  estimatedBreakeven: string;
  keyRisks: string[];
  quickWins: string[];
}

export interface AnalyzeApiRequest {
  input: FeasibilityInput;
}

export interface AnalyzeApiResponse {
  success: boolean;
  data?: FeasibilityResult;
  error?: string;
}
