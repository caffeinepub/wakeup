import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  DollarSign,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import type { Candidate } from "../backend";
import formatINR from "../utils/formatINR";

interface Props {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidateDetailModal({ candidate, onClose }: Props) {
  const skillsList = candidate.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-display font-bold text-xl shrink-0">
              {candidate.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="font-display text-xl">
                {candidate.name}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="text-primary">
                  {candidate.specialization}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {candidate.qualification}
                </Badge>
                {candidate.isProfileActive && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    ● Active
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Contact Details */}
          <div className="bg-secondary rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" /> Contact Details
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a
                href={`mailto:${candidate.email}`}
                className="text-primary hover:underline break-all"
              >
                {candidate.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <a
                href={`tel:${candidate.phone}`}
                className="text-foreground hover:text-primary"
              >
                {candidate.phone}
              </a>
            </div>
          </div>

          <Separator />

          {/* Professional Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Location
              </p>
              <p className="text-sm text-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                {candidate.location}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Experience
              </p>
              <p className="text-sm text-foreground flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                {Number(candidate.yearsOfExperience)} years
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Current Salary
              </p>
              <p className="text-sm text-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                {Number(candidate.currentSalary) > 0
                  ? `${formatINR(Number(candidate.currentSalary))}/yr`
                  : "Not disclosed"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Expected Salary
              </p>
              <p className="text-sm text-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                {Number(candidate.expectedSalary) > 0
                  ? `${formatINR(Number(candidate.expectedSalary))}/yr`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Skills */}
          {skillsList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {candidate.bio && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Professional Bio
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {candidate.bio}
                </p>
              </div>
            </>
          )}

          {/* Resume */}
          {candidate.resumeFile && (
            <>
              <Separator />
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Resume Available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Candidate has uploaded a resume
                  </p>
                </div>
                <a
                  href={candidate.resumeFile.getDirectURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-medium shrink-0"
                >
                  View
                </a>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
