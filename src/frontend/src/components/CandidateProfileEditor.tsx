import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Candidate } from "../backend";
import { useUpdateCandidateProfile } from "../hooks/useQueries";

const SPECIALIZATIONS = [
  "Retail Pharmacist",
  "Hospital Pharmacist",
  "Clinical Pharmacist",
];
const QUALIFICATIONS = ["B.Pharm", "M.Pharm", "PharmD"];

interface Props {
  candidate: Candidate;
}

export default function CandidateProfileEditor({ candidate }: Props) {
  const updateProfile = useUpdateCandidateProfile();

  const [form, setForm] = useState({
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    specialization: candidate.specialization,
    qualification: candidate.qualification,
    yearsOfExperience: String(Number(candidate.yearsOfExperience)),
    location: candidate.location,
    currentSalary: String(Number(candidate.currentSalary)),
    expectedSalary: String(Number(candidate.expectedSalary)),
    skills: candidate.skills,
    bio: candidate.bio,
  });

  useEffect(() => {
    setForm({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      specialization: candidate.specialization,
      qualification: candidate.qualification,
      yearsOfExperience: String(Number(candidate.yearsOfExperience)),
      location: candidate.location,
      currentSalary: String(Number(candidate.currentSalary)),
      expectedSalary: String(Number(candidate.expectedSalary)),
      skills: candidate.skills,
      bio: candidate.bio,
    });
  }, [candidate]);

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        id: candidate.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialization: form.specialization,
        qualification: form.qualification,
        yearsOfExperience: BigInt(Number.parseInt(form.yearsOfExperience) || 0),
        location: form.location.trim(),
        currentSalary: BigInt(Number.parseInt(form.currentSalary) || 0),
        expectedSalary: BigInt(Number.parseInt(form.expectedSalary) || 0),
        skills: form.skills.trim(),
        bio: form.bio.trim(),
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={set("name")} required />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={set("phone")} required />
            </div>
            <div className="space-y-1.5">
              <Label>Location *</Label>
              <Input
                value={form.location}
                onChange={set("location")}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Specialization *</Label>
              <Select
                value={form.specialization}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, specialization: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Qualification *</Label>
              <Select
                value={form.qualification}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, qualification: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFICATIONS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Years of Experience</Label>
              <Input
                type="number"
                min="0"
                value={form.yearsOfExperience}
                onChange={set("yearsOfExperience")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Current Salary (₹/year)</Label>
              <Input
                type="number"
                min="0"
                value={form.currentSalary}
                onChange={set("currentSalary")}
                placeholder="e.g. 400000 (₹4,00,000)"
              />
              <p className="text-xs text-muted-foreground">
                Enter amount in Indian Rupees (e.g. 4,00,000 = 4 lakhs)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Expected Salary (₹/year)</Label>
              <Input
                type="number"
                min="0"
                value={form.expectedSalary}
                onChange={set("expectedSalary")}
                placeholder="e.g. 600000 (₹6,00,000)"
              />
              <p className="text-xs text-muted-foreground">
                Enter amount in Indian Rupees (e.g. 6,00,000 = 6 lakhs)
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>
              Skills{" "}
              <span className="text-muted-foreground text-xs">
                (comma-separated)
              </span>
            </Label>
            <Input value={form.skills} onChange={set("skills")} />
          </div>
          <div className="space-y-1.5">
            <Label>Professional Bio</Label>
            <Textarea value={form.bio} onChange={set("bio")} rows={3} />
          </div>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
