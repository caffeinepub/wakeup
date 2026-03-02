import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMyEmployerProfile } from '../hooks/useQueries';
import AuthGuard from '../components/AuthGuard';
import ProfileSetupModal from '../components/ProfileSetupModal';
import JobPostingsList from '../components/JobPostingsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Search, Building2, MapPin, Users, Globe, Plus } from 'lucide-react';

export default function EmployerDashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: employer, isLoading } = useGetMyEmployerProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AuthGuard>
      <ProfileSetupModal open={showProfileSetup} onComplete={() => {}} />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Employer Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage job postings and search for pharmacy talent</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : !employer ? (
          <Card className="shadow-card border-border">
            <CardContent className="p-10 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No Employer Profile Found</h2>
              <p className="text-muted-foreground mb-6">Create your employer profile to start posting jobs.</p>
              <Button
                onClick={() => navigate({ to: '/employer/register' })}
                className="bg-primary text-primary-foreground"
              >
                Create Employer Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Company Summary */}
            <Card className="shadow-card border-border mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-primary font-display font-bold text-xl shrink-0">
                      {employer.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">{employer.companyName}</h2>
                      <p className="text-muted-foreground text-sm">{employer.industry}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{employer.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{employer.companySize} employees</span>
                        {employer.website && (
                          <a href={employer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <Globe className="w-3.5 h-3.5" />Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-primary self-start">Verified Employer</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="jobs">
              <TabsList className="mb-4">
                <TabsTrigger value="jobs" className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> My Job Postings
                </TabsTrigger>
                <TabsTrigger value="pharmsearch" className="flex items-center gap-1.5">
                  <Search className="w-4 h-4" /> PharmSearch
                </TabsTrigger>
              </TabsList>
              <TabsContent value="jobs">
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => navigate({ to: '/employer/jobs/new' })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Post New Job
                  </Button>
                </div>
                <JobPostingsList employerId={employer.id} />
              </TabsContent>
              <TabsContent value="pharmsearch">
                <Card className="shadow-card border-border">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">PharmSearch</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Search and source from thousands of verified pharmacist profiles using keywords and filters.
                    </p>
                    <Button
                      onClick={() => navigate({ to: '/employer/pharmsearch' })}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                    >
                      <Search className="w-4 h-4 mr-2" /> Open PharmSearch
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
