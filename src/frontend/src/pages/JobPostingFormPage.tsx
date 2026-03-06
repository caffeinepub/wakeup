import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import AuthGuard from "../components/AuthGuard";
import JobPostingForm from "../components/JobPostingForm";
import {
  useGetJobPostingById,
  useGetMyEmployerProfile,
} from "../hooks/useQueries";

interface Props {
  mode?: "create" | "edit";
}

export default function JobPostingFormPage({ mode }: Props) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const jobId = params.id ? BigInt(params.id) : null;
  const isEdit = mode === "edit" || !!jobId;

  const { data: employer, isLoading: employerLoading } =
    useGetMyEmployerProfile();
  const { data: jobPosting, isLoading: jobLoading } = useGetJobPostingById(
    isEdit ? jobId : null,
  );

  const isLoading = employerLoading || (isEdit && jobLoading);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/employer/dashboard" })}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isEdit ? "Edit Job Posting" : "Create New Job Posting"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit
              ? "Update the details of your job posting."
              : "Fill in the details to post a new pharmacy job."}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : !employer ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Please create an employer profile first.</p>
            <Button
              onClick={() => navigate({ to: "/employer/register" })}
              className="mt-4 bg-primary text-primary-foreground"
            >
              Create Employer Profile
            </Button>
          </div>
        ) : (
          <JobPostingForm
            employer={employer}
            jobPosting={isEdit ? (jobPosting ?? undefined) : undefined}
            onSuccess={() => navigate({ to: "/employer/dashboard" })}
          />
        )}
      </div>
    </AuthGuard>
  );
}
