"use client";

import { AccountProfileCard } from "@/components/profile/AccountProfileCard";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { AsyncBoundary } from "@/components/shared/AsyncBoundary";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { getCurrentUser } from "@/lib/api/auth";

type ProfilePageContentProps = {
  title?: string;
  description?: string;
};

export function ProfilePageContent({
  title = "Profile",
  description = "Your campus rewards account",
}: ProfilePageContentProps) {
  const { data: user, isLoading, error, refresh } = useAsyncQuery(() => getCurrentUser());

  return (
    <>
      <PageHeader as="h1" title={title} description={description} />
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refresh}
        loadingMessage="Loading profile…"
        errorTitle="Unable to load profile"
      >
        {user && (
          <div className="space-y-4">
            <AccountProfileCard user={user} />
            <ChangePasswordForm />
          </div>
        )}
      </AsyncBoundary>
    </>
  );
}
