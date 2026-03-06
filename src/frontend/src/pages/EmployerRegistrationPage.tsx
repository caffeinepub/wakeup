import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import AuthGuard from "../components/AuthGuard";
import EmployerRegistrationForm from "../components/EmployerRegistrationForm";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetMyEmployerProfile,
} from "../hooks/useQueries";

export default function EmployerRegistrationPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: employerProfile, isLoading: employerLoading } =
    useGetMyEmployerProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (employerProfile && !employerLoading) {
      navigate({ to: "/employer/dashboard" });
    }
  }, [employerProfile, employerLoading, navigate]);

  return (
    <AuthGuard>
      <ProfileSetupModal open={showProfileSetup} onComplete={() => {}} />
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Create Employer Profile
          </h1>
          <p className="text-muted-foreground">
            Set up your company profile to start posting jobs and sourcing
            pharmacists.
          </p>
        </div>
        {employerLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <EmployerRegistrationForm
            onSuccess={() => navigate({ to: "/employer/dashboard" })}
          />
        )}
      </div>
    </AuthGuard>
  );
}
