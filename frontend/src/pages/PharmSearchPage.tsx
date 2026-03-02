import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSearchCandidates } from '../hooks/useQueries';
import AuthGuard from '../components/AuthGuard';
import CandidateCard from '../components/CandidateCard';
import CandidateDetailModal from '../components/CandidateDetailModal';
import PharmSearchFilters from '../components/PharmSearchFilters';
import type { Candidate } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SearchFilters {
  keywords: string;
  specialization: string | null;
  qualification: string | null;
  minExperience: bigint | null;
  maxExperience: bigint | null;
  location: string | null;
}

export default function PharmSearchPage() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: '',
    specialization: null,
    qualification: null,
    minExperience: null,
    maxExperience: null,
    location: null,
  });

  const { data: candidates, isLoading, isFetching } = useSearchCandidates(filters);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/employer/dashboard' })}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Search className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">PharmSearch</h1>
            </div>
            <Badge className="bg-coral-400 text-white border-0 text-xs">Candidate Database</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Search and source verified pharmacist profiles using keywords and filters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <PharmSearchFilters filters={filters} onChange={setFilters} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isLoading || isFetching ? (
                    'Searching...'
                  ) : (
                    <>{candidates?.length ?? 0} candidate{(candidates?.length ?? 0) !== 1 ? 's' : ''} found</>
                  )}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-36 w-full rounded-xl" />
                ))}
              </div>
            ) : !candidates || candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No candidates found</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Try adjusting your search keywords or filters to find more candidates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id.toString()}
                    candidate={candidate}
                    onClick={() => setSelectedCandidate(candidate)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </AuthGuard>
  );
}
