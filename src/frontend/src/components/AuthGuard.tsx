import { Button } from "@/components/ui/button";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import type React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, loginStatus, isInitializing } =
    useInternetIdentity();

  if (isInitializing) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="auth.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4"
        data-ocid="auth.panel"
      >
        <div className="bg-secondary rounded-full p-6">
          <Lock className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-3">
            Use Internet Identity to securely log in — no password needed.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-teal-600 bg-teal-50 rounded-lg px-4 py-2.5 border border-teal-100">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Your data is encrypted and decentralized on ICP</span>
          </div>
        </div>
        <Button
          data-ocid="auth.primary_button"
          onClick={login}
          disabled={loginStatus === "logging-in"}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
            </>
          ) : (
            "Login to Continue"
          )}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
