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
import { useRegisterEmployer } from "../hooks/useQueries";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "200+"];

interface Props {
  onSuccess: () => void;
}

export default function EmployerRegistrationForm({ onSuccess }: Props) {
  const registerEmployer = useRegisterEmployer();

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    location: "",
    about: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!form.contactName.trim())
      newErrors.contactName = "Contact name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.industry.trim()) newErrors.industry = "Industry is required";
    if (!form.companySize) newErrors.companySize = "Company size is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.about.trim()) newErrors.about = "Company description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await registerEmployer.mutateAsync({
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        industry: form.industry.trim(),
        companySize: form.companySize,
        location: form.location.trim(),
        about: form.about.trim(),
        website: form.website.trim(),
      });
      toast.success("Employer profile created!");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create employer profile");
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
              <Label>Company Name *</Label>
              <Input
                value={form.companyName}
                onChange={set("companyName")}
                placeholder="Apollo Pharmacy"
              />
              {errors.companyName && (
                <p className="text-destructive text-xs">{errors.companyName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Contact Person Name *</Label>
              <Input
                value={form.contactName}
                onChange={set("contactName")}
                placeholder="Rahul Mehta"
              />
              {errors.contactName && (
                <p className="text-destructive text-xs">{errors.contactName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="hr@company.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number *</Label>
              <Input
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-destructive text-xs">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Industry *</Label>
              <Input
                value={form.industry}
                onChange={set("industry")}
                placeholder="Healthcare / Pharmacy"
              />
              {errors.industry && (
                <p className="text-destructive text-xs">{errors.industry}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Company Size *</Label>
              <Select
                value={form.companySize}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, companySize: v }));
                  setErrors((p) => ({ ...p, companySize: "" }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companySize && (
                <p className="text-destructive text-xs">{errors.companySize}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Headquarters Location *</Label>
              <Input
                value={form.location}
                onChange={set("location")}
                placeholder="Mumbai, Maharashtra"
              />
              {errors.location && (
                <p className="text-destructive text-xs">{errors.location}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Website{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Input
                value={form.website}
                onChange={set("website")}
                placeholder="https://www.company.com"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>About Company *</Label>
            <Textarea
              value={form.about}
              onChange={set("about")}
              placeholder="Brief description of your company, culture, and what makes you a great employer..."
              rows={4}
            />
            {errors.about && (
              <p className="text-destructive text-xs">{errors.about}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={registerEmployer.isPending}
          >
            {registerEmployer.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                Profile...
              </>
            ) : (
              "Create Employer Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
