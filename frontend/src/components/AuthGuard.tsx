import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="bg-secondary rounded-full p-6">
          <Lock className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground max-w-sm">
            Please log in to access this page. Wakeup uses secure Internet Identity for authentication.
          </p>
        </div>
        <Button
          onClick={login}
          disabled={loginStatus === 'logging-in'}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {loginStatus === 'logging-in' ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...</>
          ) : 'Login to Continue'}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
