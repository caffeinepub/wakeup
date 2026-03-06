import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Loader2,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { JobPosting } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApplyToJob,
  useGetCallerUserProfile,
  useGetEmployerById,
  useGetMyProfile,
} from "../hooks/useQueries";
import formatINR from "../utils/formatINR";

interface Props {
  job: JobPosting;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: Props) {
  const { data: employer, isLoading: employerLoading } = useGetEmployerById(
    job.employerId,
  );
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: candidateProfile } = useGetMyProfile();
  const applyToJob = useApplyToJob();
  const [hasApplied, setHasApplied] = useState(false);

  const isAuthenticated = !!identity;
  const isCandidate = userProfile?.role === "candidate";
  const isEmployer = userProfile?.role === "employer";
  const showApplyButton = isAuthenticated && isCandidate && !isEmployer;

  const specializations = job.specializations
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const qualifications = job.qualifications
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const skills = job.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const postedDate = new Date(Number(job.postedAt) / 1_000_000);
  const daysAgo = Math.floor(
    (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const postedLabel =
    daysAgo === 0
      ? "Today"
      : daysAgo === 1
        ? "1 day ago"
        : `${daysAgo} days ago`;

  const handleApply = async () => {
    if (!candidateProfile) {
      toast.error("Please complete your candidate profile before applying.", {
        description: "Go to My Profile to set up your profile.",
      });
      return;
    }

    try {
      await applyToJob.mutateAsync(job.id);
      setHasApplied(true);
      toast.success("Application submitted!", {
        description: `You have successfully applied for ${job.title}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("Already applied")) {
        setHasApplied(true);
        toast.info("You have already applied for this job.");
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary font-display font-bold text-xl shrink-0">
              {employer?.companyName?.charAt(0)?.toUpperCase() ?? (
                <Building2 className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-display text-xl leading-tight">
                {job.title}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {employerLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    {employer?.companyName ?? "Unknown Company"}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Key Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-secondary rounded-lg p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Location
              </p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {job.location}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Experience
              </p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                {Number(job.minExperience)}-{Number(job.maxExperience)} yrs
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-3 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Salary Range
              </p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                {Number(job.salaryMin) > 0
                  ? `${formatINR(Number(job.salaryMin))} – ${formatINR(Number(job.salaryMax))}`
                  : "Not disclosed"}
              </p>
            </div>
          </div>

          {/* Specializations & Qualifications */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {specializations.map((s) => (
                <Badge key={s} variant="secondary" className="text-primary">
                  {s}
                </Badge>
              ))}
              {qualifications.map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <GraduationCap className="w-3 h-3" />
                  {q}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Job Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" /> Job Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          {skills.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Company Info */}
          {employer && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary" /> About{" "}
                  {employer.companyName}
                </h4>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {employer.companySize} employees
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {employer.location}
                  </span>
                  {employer.website && (
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>
                {employer.about && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {employer.about}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Posted Date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Clock className="w-3.5 h-3.5" />
            Posted {postedLabel}
          </div>

          {/* Apply Button for Candidates */}
          {showApplyButton && (
            <>
              <Separator />
              <div className="pt-1">
                {hasApplied ? (
                  <Button
                    disabled
                    className="w-full bg-primary/20 text-primary border border-primary/30 cursor-not-allowed"
                    variant="outline"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Applied
                  </Button>
                ) : (
                  <Button
                    onClick={handleApply}
                    disabled={applyToJob.isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-5"
                  >
                    {applyToJob.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your saved profile will be submitted to the employer
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
