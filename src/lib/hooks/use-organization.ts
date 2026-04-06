"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Organization } from "@/lib/types";
import { useAppStore } from "@/lib/stores/app-store";

interface UseOrganizationReturn {
  organization: Organization | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<void>;
}

export function useOrganization(): UseOrganizationReturn {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();
  const currentOrganizationId = useAppStore(
    (state) => state.currentOrganizationId
  );
  const setCurrentOrganizationId = useAppStore(
    (state) => state.setCurrentOrganizationId
  );

  const fetchOrganization = useCallback(
    async (orgId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", orgId)
          .single();

        if (orgError) {
          setError(new Error(orgError.message));
          setOrganization(null);
          return;
        }

        setOrganization(data as unknown as Organization);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load organization")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  const loadOrganizationFromProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.organization_id) {
        setError(
          new Error(profileError?.message ?? "No organization found for user")
        );
        setIsLoading(false);
        return;
      }

      setCurrentOrganizationId(profile.organization_id);
      await fetchOrganization(profile.organization_id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to load organization")
      );
      setIsLoading(false);
    }
  }, [supabase, fetchOrganization, setCurrentOrganizationId]);

  useEffect(() => {
    if (currentOrganizationId) {
      fetchOrganization(currentOrganizationId);
    } else {
      loadOrganizationFromProfile();
    }
  }, [currentOrganizationId, fetchOrganization, loadOrganizationFromProfile]);

  const refresh = useCallback(async () => {
    if (currentOrganizationId) {
      await fetchOrganization(currentOrganizationId);
    } else {
      await loadOrganizationFromProfile();
    }
  }, [currentOrganizationId, fetchOrganization, loadOrganizationFromProfile]);

  const switchOrganization = useCallback(
    async (organizationId: string) => {
      setCurrentOrganizationId(organizationId);
      await fetchOrganization(organizationId);
    },
    [setCurrentOrganizationId, fetchOrganization]
  );

  return {
    organization,
    isLoading,
    error,
    refresh,
    switchOrganization,
  };
}
