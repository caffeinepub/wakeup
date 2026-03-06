import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import type { JobPosting } from "../backend";
import { useGetEmployerById } from "../hooks/useQueries";
import formatINR from "../utils/formatINR";

interface Props {
  job: JobPosting;
  onClick: () => void;
}

export default function JobListingCard({ job, onClick }: Props) {
  const { data: employer } = useGetEmployerById(job.employerId);

  const specializations = job.specializations
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const qualifications = job.qualifications
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

  return (
    <Card
      className="shadow-card border-border card-hover cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title & Company */}
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-display font-bold shrink-0">
                {employer?.companyName?.charAt(0)?.toUpperCase() ?? (
                  <Building2 className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground leading-tight">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {employer?.companyName ?? "Loading..."}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {Number(job.minExperience)}-{Number(job.maxExperience)} yrs
              </span>
              {(Number(job.salaryMin) > 0 || Number(job.salaryMax) > 0) && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {formatINR(Number(job.salaryMin))} –{" "}
                  {formatINR(Number(job.salaryMax))}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {postedLabel}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {specializations.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="text-primary text-xs"
                >
                  {s}
                </Badge>
              ))}
              {qualifications.map((q) => (
                <Badge key={q} variant="outline" className="text-xs">
                  {q}
                </Badge>
              ))}
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
