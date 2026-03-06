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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterCandidate } from "../hooks/useQueries";

const SPECIALIZATIONS = [
  "Retail Pharmacist",
  "Hospital Pharmacist",
  "Clinical Pharmacist",
];
const QUALIFICATIONS = ["B.Pharm", "M.Pharm", "PharmD"];

interface Props {
  onSuccess: () => void;
}

export default function CandidateRegistrationForm({ onSuccess }: Props) {
  const registerCandidate = useRegisterCandidate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    yearsOfExperience: "",
    location: "",
    currentSalary: "",
    expectedSalary: "",
    skills: "",
    bio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.specialization)
      newErrors.specialization = "Specialization is required";
    if (!form.qualification)
      newErrors.qualification = "Qualification is required";
    if (!form.yearsOfExperience)
      newErrors.yearsOfExperience = "Experience is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.expectedSalary)
      newErrors.expectedSalary = "Expected salary is required";
    if (!form.skills.trim()) newErrors.skills = "Skills are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await registerCandidate.mutateAsync({
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
      toast.success("Profile created successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(
        err?.message || "Failed to create profile. Please try again.",
      );
    }
  };

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Dr. Priya Sharma"
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="priya@example.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-destructive text-xs">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location (City/State) *</Label>
              <Input
                id="location"
                value={form.location}
                onChange={set("location")}
                placeholder="Mumbai, Maharashtra"
              />
              {errors.location && (
                <p className="text-destructive text-xs">{errors.location}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Specialization *</Label>
              <Select
                value={form.specialization}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, specialization: v }));
                  setErrors((p) => ({ ...p, specialization: "" }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="text-destructive text-xs">
                  {errors.specialization}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Qualification *</Label>
              <Select
                value={form.qualification}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, qualification: v }));
                  setErrors((p) => ({ ...p, qualification: "" }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFICATIONS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.qualification && (
                <p className="text-destructive text-xs">
                  {errors.qualification}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp">Years of Experience *</Label>
              <Input
                id="exp"
                type="number"
                min="0"
                max="50"
                value={form.yearsOfExperience}
                onChange={set("yearsOfExperience")}
                placeholder="e.g. 3"
              />
              {errors.yearsOfExperience && (
                <p className="text-destructive text-xs">
                  {errors.yearsOfExperience}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentSalary">
                Current Salary (₹/year, optional)
              </Label>
              <Input
                id="currentSalary"
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
              <Label htmlFor="expectedSalary">Expected Salary (₹/year) *</Label>
              <Input
                id="expectedSalary"
                type="number"
                min="0"
                value={form.expectedSalary}
                onChange={set("expectedSalary")}
                placeholder="e.g. 600000 (₹6,00,000)"
              />
              {errors.expectedSalary && (
                <p className="text-destructive text-xs">
                  {errors.expectedSalary}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skills">
              Skills *{" "}
              <span className="text-muted-foreground text-xs">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="skills"
              value={form.skills}
              onChange={set("skills")}
              placeholder="Drug dispensing, Patient counseling, Inventory management"
            />
            {errors.skills && (
              <p className="text-destructive text-xs">{errors.skills}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={set("bio")}
              placeholder="Brief description of your experience and expertise..."
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={registerCandidate.isPending}
          >
            {registerCandidate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                Profile...
              </>
            ) : (
              "Create My Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
