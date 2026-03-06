import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ChevronRight, GraduationCap, MapPin } from "lucide-react";
import type { Candidate } from "../backend";
import formatINR from "../utils/formatINR";

interface Props {
  candidate: Candidate;
  onClick: () => void;
}

export default function CandidateCard({ candidate, onClick }: Props) {
  const skillsList = candidate.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <Card
      className="shadow-card border-border card-hover cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
              {candidate.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-foreground">
                  {candidate.name}
                </h3>
                {candidate.isProfileActive && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    Active
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="text-primary text-xs">
                  {candidate.specialization}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <GraduationCap className="w-3 h-3" />
                  {candidate.qualification}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {Number(candidate.yearsOfExperience)} yrs experience
                </span>
                {Number(candidate.expectedSalary) > 0 && (
                  <span className="flex items-center gap-1">
                    {formatINR(Number(candidate.expectedSalary))}/yr expected
                  </span>
                )}
              </div>

              {skillsList.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.split(",").filter((s) => s.trim()).length >
                    4 && (
                    <span className="inline-block text-xs text-muted-foreground px-1 py-0.5">
                      +
                      {candidate.skills.split(",").filter((s) => s.trim())
                        .length - 4}{" "}
                      more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
