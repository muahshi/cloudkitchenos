"use client";

import { useState, useCallback } from "react";
import type {
  FeasibilityInput,
  FeasibilityResult,
  KitchenType,
} from "@/types/database";

// ── Step Definitions ─────────────────────────────────────────────────────────
export const STEPS = [
  { id: 1, label: "Location", description: "Where are you setting up?" },
  { id: 2, label: "Budget", description: "What's your investment?" },
  { id: 3, label: "Kitchen", description: "Choose your model" },
  { id: 4, label: "Cuisine", description: "What will you serve?" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

// ── Initial State ─────────────────────────────────────────────────────────────
const INITIAL_INPUT: FeasibilityInput = {
  location: "",
  budget: 300000,
  kitchenType: "ghost_kitchen",
  cuisine: "",
  targetCustomers: "",
  operatingHours: "10am–11pm",
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCalculator() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [input, setInput] = useState<FeasibilityInput>(INITIAL_INPUT);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // ── Field updater ──────────────────────────────────────────────────────────
  const updateField = useCallback(
    <K extends keyof FeasibilityInput>(field: K, value: FeasibilityInput[K]) => {
      setInput((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  // ── Step validation ────────────────────────────────────────────────────────
  const validateStep = useCallback(
    (step: StepId): string | null => {
      switch (step) {
        case 1:
          if (!input.location.trim() || input.location.trim().length < 3)
            return "Please enter a valid city or area (min 3 characters).";
          return null;
        case 2:
          if (!input.budget || input.budget < 50000)
            return "Minimum budget is ₹50,000 for a viable cloud kitchen.";
          if (input.budget > 50000000)
            return "Please enter a budget under ₹5 Crore.";
          return null;
        case 3:
          if (!input.kitchenType) return "Please select a kitchen type.";
          return null;
        case 4:
          if (!input.cuisine.trim() || input.cuisine.trim().length < 2)
            return "Please enter your cuisine type.";
          return null;
        default:
          return null;
      }
    },
    [input]
  );

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => (prev + 1) as StepId);
    }
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepId);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: StepId) => {
      // Only allow going back to completed steps
      if (step < currentStep) {
        setCurrentStep(step);
        setError(null);
      }
    },
    [currentStep]
  );

  // ── Analysis submission ────────────────────────────────────────────────────
  const analyzeKitchen = useCallback(async () => {
    const validationError = validateStep(4);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Analysis failed. Please try again.");
      }

      setResult(json.data as FeasibilityResult);
      setShowResult(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please retry."
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, validateStep]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetCalculator = useCallback(() => {
    setCurrentStep(1);
    setInput(INITIAL_INPUT);
    setResult(null);
    setError(null);
    setShowResult(false);
    setIsLoading(false);
  }, []);

  // ── Computed ───────────────────────────────────────────────────────────────
  const isLastStep = currentStep === STEPS.length;
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return {
    // State
    currentStep,
    input,
    result,
    isLoading,
    error,
    showResult,
    // Computed
    isLastStep,
    progress,
    steps: STEPS,
    // Actions
    updateField,
    goNext,
    goBack,
    goToStep,
    analyzeKitchen,
    resetCalculator,
  };
}

// ── Kitchen type display helpers ──────────────────────────────────────────────
export const KITCHEN_TYPE_OPTIONS: {
  value: KitchenType;
  label: string;
  description: string;
  icon: string;
  minBudget: string;
}[] = [
  {
    value: "ghost_kitchen",
    label: "Ghost Kitchen",
    description: "Delivery-only, no dine-in. Lowest overhead.",
    icon: "👻",
    minBudget: "₹2–5L",
  },
  {
    value: "shared_kitchen",
    label: "Shared Kitchen",
    description: "Rent a licensed commercial kitchen by the hour.",
    icon: "🤝",
    minBudget: "₹50K–1L",
  },
  {
    value: "home_kitchen",
    label: "Home Kitchen",
    description: "Start from home with FSSAI basic registration.",
    icon: "🏠",
    minBudget: "₹20–50K",
  },
  {
    value: "cloud_kitchen_franchise",
    label: "Cloud Franchise",
    description: "Buy into an established cloud kitchen brand.",
    icon: "🏢",
    minBudget: "₹5–20L",
  },
];

export const CUISINE_SUGGESTIONS = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Biryani",
  "Pizza",
  "Burgers",
  "Healthy / Salads",
  "Desserts",
  "Thali",
  "Rolls & Wraps",
  "Momos",
  "Multi-cuisine",
];

export const POPULAR_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Bhopal",
  "Lucknow",
  "Indore",
  "Surat",
  "Nagpur",
  "Chandigarh",
];
