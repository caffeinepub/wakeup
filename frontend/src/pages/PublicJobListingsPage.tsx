import { useState } from 'react';
import { useGetAllActiveJobPostings, useGetEmployerById } from '../hooks/useQueries';
import type { JobPosting } from '../backend';
import JobListingCard from '../components/JobListingCard';
import JobDetailModal from '../components/JobDetailModal';
import JobListingsFilters from '../components/JobListingsFilters';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Search } from 'lucide-react';

export interface JobFilters {
  specialization: string | null;
  location: string;
  minExperience: string;
  maxExperience: string;
}

export default function PublicJobListingsPage() {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    specialization: null,
    location: '',
    minExperience: '',
    maxExperience: '',
  });

  const { data: jobs, isLoading } = useGetAllActiveJobPostings();

  const filteredJobs = (jobs ?? []).filter(job => {
    if (filters.specialization) {
      const specs = job.specializations.split(',').map(s => s.trim());
      if (!specs.includes(filters.specialization)) return false;
    }
    if (filters.location) {
      if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }
    if (filters.minExperience) {
      if (Number(job.maxExperience) < parseInt(filters.minExperience)) return false;
    }
    if (filters.maxExperience) {
      if (Number(job.minExperience) > parseInt(filters.maxExperience)) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Pharmacy Jobs</h1>
          <Badge variant="secondary" className="text-primary ml-1">
            {isLoading ? '...' : filteredJobs.length} Active
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Browse the latest pharmacy job openings from top healthcare employers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <JobListingsFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              {isLoading ? 'Loading jobs...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Try adjusting your filters or check back later for new openings.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map(job => (
                <JobListingCard
                  key={job.id.toString()}
                  job={job}
                  onClick={() => setSelectedJob(job)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
