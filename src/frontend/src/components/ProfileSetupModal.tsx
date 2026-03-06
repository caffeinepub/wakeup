import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pill } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({
  open,
  onComplete,
}: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim(), role });
      toast.success("Profile created successfully!");
      onComplete();
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        data-ocid="profile_setup.dialog"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex justify-center mb-2">
          <div className="bg-secondary rounded-full p-3 border border-primary/20">
            <Pill className="w-8 h-8 text-primary" />
          </div>
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-xl">
            Welcome to Idea Algo!
          </DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself to get started on India's leading
            pharmacy job portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Full Name *</Label>
            <Input
              id="name"
              data-ocid="profile_setup.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Priya Sharma"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">I am a... *</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger data-ocid="profile_setup.select">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidate">
                  Pharmacist / Job Seeker
                </SelectItem>
                <SelectItem value="employer">Employer / Recruiter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            data-ocid="profile_setup.submit_button"
            className="w-full bg-primary text-primary-foreground"
            disabled={!name.trim() || !role || saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
