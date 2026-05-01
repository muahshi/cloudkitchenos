"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, signOut, checkProAccess } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isPro: boolean;
  loading: boolean;
  initialized: boolean;
}

export function useAuth(options?: { requireAuth?: boolean; redirectTo?: string }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isPro: false,
    loading: true,
    initialized: false,
  });

  const loadProStatus = useCallback(async (userId: string) => {
    try {
      const isPro = await checkProAccess(userId);
      setState((prev) => ({ ...prev, isPro }));
    } catch {
      // Silently fail — PRO check is non-critical
    }
  }, []);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
        initialized: true,
      }));

      if (session?.user) {
        loadProStatus(session.user.id);
      }

      // Redirect if requireAuth and no session
      if (options?.requireAuth && !session) {
        router.replace(options.redirectTo ?? "/login");
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session: session ?? null,
          isPro: session ? prev.isPro : false,
          loading: false,
        }));

        if (event === "SIGNED_IN" && session?.user) {
          loadProStatus(session.user.id);
        }

        if (event === "SIGNED_OUT" && options?.requireAuth) {
          router.replace(options.redirectTo ?? "/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, options?.requireAuth, options?.redirectTo, loadProStatus]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
  }, [router]);

  return {
    ...state,
    isAuthenticated: !!state.user,
    signOut: handleSignOut,
  };
}
