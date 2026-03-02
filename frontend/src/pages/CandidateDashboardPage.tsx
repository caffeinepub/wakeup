import { useGetMyProfile, useGetCallerUserProfile, useToggleProfileActive } from '../hooks/useQueries';
import AuthGuard from '../components/AuthGuard';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CandidateProfileEditor from '../components/CandidateProfileEditor';
import ResumeUploadSection from '../components/ResumeUploadSection';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { User, FileText, Settings, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import formatINR from '../utils/formatINR';

export default function CandidateDashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: candidate, isLoading } = useGetMyProfile();
  const toggleActive = useToggleProfileActive();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleToggle = async () => {
    if (!candidate) return;
    try {
      const newStatus = await toggleActive.mutateAsync(candidate.id);
      toast.success(`Profile is now ${newStatus ? 'Active' : 'Inactive'}`);
    } catch {
      toast.error('Failed to update profile status');
    }
  };

  return (
    <AuthGuard>
      <ProfileSetupModal open={showProfileSetup} onComplete={() => {}} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Candidate Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your pharmacist profile and resume</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : !candidate ? (
          <Card className="shadow-card border-border">
            <CardContent className="p-10 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No Profile Found</h2>
              <p className="text-muted-foreground mb-6">You haven't created a candidate profile yet.</p>
              <Button
                onClick={() => navigate({ to: '/candidate/register' })}
                className="bg-primary text-primary-foreground"
              >
                Create Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Profile Summary Card */}
            <Card className="shadow-card border-border mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary font-display font-bold text-xl shrink-0">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">{candidate.name}</h2>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="secondary" className="text-primary">{candidate.specialization}</Badge>
                        <Badge variant="outline">{candidate.qualification}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{candidate.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{Number(candidate.yearsOfExperience)} yrs exp</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {formatINR(Number(candidate.expectedSalary))}/yr expected
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="profile-active"
                        checked={candidate.isProfileActive}
                        onCheckedChange={handleToggle}
                        disabled={toggleActive.isPending}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="profile-active" className="text-sm font-medium cursor-pointer">
                        {candidate.isProfileActive ? (
                          <span className="text-primary">Profile Active</span>
                        ) : (
                          <span className="text-muted-foreground">Profile Inactive</span>
                        )}
                      </Label>
                    </div>
                    <Badge
                      variant={candidate.isProfileActive ? 'default' : 'secondary'}
                      className={candidate.isProfileActive ? 'bg-primary text-primary-foreground' : ''}
                    >
                      {candidate.isProfileActive ? '● Visible to Employers' : '○ Hidden'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile" className="flex items-center gap-1.5">
                  <Settings className="w-4 h-4" /> Edit Profile
                </TabsTrigger>
                <TabsTrigger value="resume" className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Resume
                </TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <CandidateProfileEditor candidate={candidate} />
              </TabsContent>
              <TabsContent value="resume">
                <ResumeUploadSection candidate={candidate} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
