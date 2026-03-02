import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Candidate, Employer, JobPosting, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ---- Candidate ----

export function useGetMyProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Candidate | null>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCandidateById(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Candidate | null>({
    queryKey: ['candidate', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCandidateById(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useRegisterCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string; email: string; phone: string; specialization: string;
      qualification: string; yearsOfExperience: bigint; location: string;
      currentSalary: bigint; expectedSalary: bigint; skills: string; bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerCandidate(
        params.name, params.email, params.phone, params.specialization,
        params.qualification, params.yearsOfExperience, params.location,
        params.currentSalary, params.expectedSalary, params.skills, params.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
}

export function useUpdateCandidateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint; name: string; email: string; phone: string; specialization: string;
      qualification: string; yearsOfExperience: bigint; location: string;
      currentSalary: bigint; expectedSalary: bigint; skills: string; bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCandidateProfile(
        params.id, params.name, params.email, params.phone, params.specialization,
        params.qualification, params.yearsOfExperience, params.location,
        params.currentSalary, params.expectedSalary, params.skills, params.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
}

export function useUploadResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { candidateId: bigint; file: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadResume(params.candidateId, params.file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
}

export function useToggleProfileActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidateId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleProfileActive(candidateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
}

export function useSearchCandidates(params: {
  keywords: string;
  specialization: string | null;
  qualification: string | null;
  minExperience: bigint | null;
  maxExperience: bigint | null;
  location: string | null;
}) {
  const { actor, isFetching: actorFetching } = useActor();

  // Serialize bigint values to strings for the query key to avoid BigInt-in-query-key lint error
  const queryKey = [
    'searchCandidates',
    params.keywords,
    params.specialization,
    params.qualification,
    params.minExperience !== null ? params.minExperience.toString() : null,
    params.maxExperience !== null ? params.maxExperience.toString() : null,
    params.location,
  ];

  return useQuery<Candidate[]>({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCandidates(
        params.keywords,
        params.specialization,
        params.qualification,
        params.minExperience,
        params.maxExperience,
        params.location
      );
    },
    enabled: !!actor && !actorFetching,
  });
}

// ---- Employer ----

export function useGetMyEmployerProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Employer | null>({
    queryKey: ['myEmployerProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyEmployerProfile();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetEmployerById(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Employer | null>({
    queryKey: ['employer', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getEmployerById(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useRegisterEmployer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      companyName: string; contactName: string; email: string; phone: string;
      industry: string; companySize: string; location: string; about: string; website: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerEmployer(
        params.companyName, params.contactName, params.email, params.phone,
        params.industry, params.companySize, params.location, params.about, params.website
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmployerProfile'] });
    },
  });
}

export function useUpdateEmployerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint; companyName: string; contactName: string; email: string; phone: string;
      industry: string; companySize: string; location: string; about: string; website: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmployerProfile(
        params.id, params.companyName, params.contactName, params.email, params.phone,
        params.industry, params.companySize, params.location, params.about, params.website
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmployerProfile'] });
    },
  });
}

// ---- Job Postings ----

export function useGetAllActiveJobPostings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['activeJobPostings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActiveJobPostings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetJobPostingsByEmployer(employerId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['jobPostingsByEmployer', employerId?.toString()],
    queryFn: async () => {
      if (!actor || employerId === null) return [];
      return actor.getJobPostingsByEmployer(employerId);
    },
    enabled: !!actor && !actorFetching && employerId !== null,
  });
}

export function useGetJobPostingById(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting | null>({
    queryKey: ['jobPosting', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getJobPostingById(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useCreateJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      employerId: bigint; title: string; specializations: string; qualifications: string;
      minExperience: bigint; maxExperience: bigint; location: string;
      salaryMin: bigint; salaryMax: bigint; description: string; skills: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJobPosting(
        params.employerId, params.title, params.specializations, params.qualifications,
        params.minExperience, params.maxExperience, params.location,
        params.salaryMin, params.salaryMax, params.description, params.skills
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobPostingsByEmployer', variables.employerId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['activeJobPostings'] });
    },
  });
}

export function useUpdateJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint; title: string; specializations: string; qualifications: string;
      minExperience: bigint; maxExperience: bigint; location: string;
      salaryMin: bigint; salaryMax: bigint; description: string; skills: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobPosting(
        params.id, params.title, params.specializations, params.qualifications,
        params.minExperience, params.maxExperience, params.location,
        params.salaryMin, params.salaryMax, params.description, params.skills
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobPosting', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['jobPostingsByEmployer'] });
      queryClient.invalidateQueries({ queryKey: ['activeJobPostings'] });
    },
  });
}

export function useToggleJobPostingActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleJobPostingActive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostingsByEmployer'] });
      queryClient.invalidateQueries({ queryKey: ['activeJobPostings'] });
    },
  });
}

// ---- Job Applications ----

export function useApplyToJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobPostingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyToJob(jobPostingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useGetApplicationsForJob(jobPostingId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Candidate[]>({
    queryKey: ['applications', jobPostingId?.toString()],
    queryFn: async () => {
      if (!actor || jobPostingId === null) return [];
      return actor.getApplicationsForJob(jobPostingId);
    },
    enabled: !!actor && !actorFetching && jobPostingId !== null,
  });
}
