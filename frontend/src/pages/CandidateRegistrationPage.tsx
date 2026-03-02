import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMyProfile, useRegisterCandidate, useSaveCallerUserProfile } from '../hooks/useQueries';
import AuthGuard from '../components/AuthGuard';
import ProfileSetupModal from '../components/ProfileSetupModal';
import CandidateRegistrationForm from '../components/CandidateRegistrationForm';
import { Loader2 } from 'lucide-react';

export default function CandidateRegistrationPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: candidateProfile, isLoading: candidateLoading } = useGetMyProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (candidateProfile && !candidateLoading) {
      navigate({ to: '/candidate/dashboard' });
    }
  }, [candidateProfile, candidateLoading, navigate]);

  return (
    <AuthGuard>
      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={() => {}}
      />
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Your Pharmacist Profile</h1>
          <p className="text-muted-foreground">Fill in your details to get discovered by top healthcare employers.</p>
        </div>
        {candidateLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <CandidateRegistrationForm
            onSuccess={() => navigate({ to: '/candidate/dashboard' })}
          />
        )}
      </div>
    </AuthGuard>
  );
}
