import { useState } from 'react';
import { useGetJobPostingsByEmployer, useToggleJobPostingActive, useGetApplicationsForJob } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Edit, ToggleLeft, ToggleRight, MapPin, Briefcase, DollarSign,
  Loader2, Users, ChevronDown, ChevronUp, UserX
} from 'lucide-react';
import { toast } from 'sonner';
import type { Candidate, JobPosting } from '../backend';
import CandidateCard from './CandidateCard';
import CandidateDetailModal from './CandidateDetailModal';
import formatINR from '../utils/formatINR';

interface Props {
  employerId: bigint;
}

// Sub-component to fetch and display applications for a single job
function JobApplications({ jobId }: { jobId: bigint }) {
  const { data: applicants, isLoading, isError } = useGetApplicationsForJob(jobId);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2 pt-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive pt-3">Failed to load applications.</p>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <UserX className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No applications yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2 pt-3">
        {applicants.map((candidate) => (
          <CandidateCard
            key={candidate.id.toString()}
            candidate={candidate}
            onClick={() => setSelectedCandidate(candidate)}
          />
        ))}
      </div>
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
}

// Sub-component for a single job posting card with applications toggle
function JobPostingCard({ job, onToggle, isToggling }: {
  job: JobPosting;
  onToggle: (id: bigint) => void;
  isToggling: boolean;
}) {
  const navigate = useNavigate();
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const { data: applicants } = useGetApplicationsForJob(job.id);
  const applicantCount = applicants?.length ?? 0;

  return (
    <Card className="shadow-card border-border card-hover">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-foreground">{job.title}</h3>
              <Badge
                variant={job.isActive ? 'default' : 'secondary'}
                className={job.isActive ? 'bg-primary text-primary-foreground text-xs' : 'text-xs'}
              >
                {job.isActive ? '● Active' : '○ Inactive'}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{Number(job.minExperience)}-{Number(job.maxExperience)} yrs</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{formatINR(Number(job.salaryMin))} – {formatINR(Number(job.salaryMax))}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {job.specializations.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/employer/jobs/$id/edit', params: { id: job.id.toString() } })}
              className="border-border"
            >
              <Edit className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggle(job.id)}
              disabled={isToggling}
              className={job.isActive ? 'border-destructive text-destructive hover:bg-destructive/10' : 'border-primary text-primary hover:bg-secondary'}
            >
              {isToggling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : job.isActive ? (
                <><ToggleRight className="w-3.5 h-3.5 mr-1" /> Deactivate</>
              ) : (
                <><ToggleLeft className="w-3.5 h-3.5 mr-1" /> Activate</>
              )}
            </Button>
          </div>
        </div>

        {/* Applications collapsible section */}
        <Collapsible open={applicationsOpen} onOpenChange={setApplicationsOpen}>
          <CollapsibleTrigger asChild>
            <button className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Applications
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2">
                  {applicantCount}
                </Badge>
              </span>
              {applicationsOpen
                ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
              }
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <JobApplications jobId={job.id} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default function JobPostingsList({ employerId }: Props) {
  const { data: jobs, isLoading } = useGetJobPostingsByEmployer(employerId);
  const toggleActive = useToggleJobPostingActive();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (jobId: bigint) => {
    setTogglingId(jobId.toString());
    try {
      const newStatus = await toggleActive.mutateAsync(jobId);
      toast.success(`Job posting is now ${newStatus ? 'Active' : 'Inactive'}`);
    } catch {
      toast.error('Failed to update job status');
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card className="shadow-card border-border">
        <CardContent className="p-10 text-center">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No job postings yet. Create your first job posting!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobPostingCard
          key={job.id.toString()}
          job={job}
          onToggle={handleToggle}
          isToggling={togglingId === job.id.toString()}
        />
      ))}
    </div>
  );
}
