'use client';

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import { Profile } from "@/types";
import { SimpleHeader } from "@/components/layout/simple-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  const isAdmin = user?.user.User.role === Profile.ADMIN;

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo iconSize={48} textSize="text-4xl" href="/dashboard" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  function getLayout() {
    if (isAdmin){
      return <AppShell>{children}</AppShell>
    }
    return <><SimpleHeader />{children}</>
  }
  return getLayout();
}
