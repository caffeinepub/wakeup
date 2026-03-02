import { useState, useEffect } from 'react';
import { useCreateJobPosting, useUpdateJobPosting } from '../hooks/useQueries';
import type { Employer, JobPosting } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const SPECIALIZATIONS = ['Retail Pharmacist', 'Hospital Pharmacist', 'Clinical Pharmacist'];
const QUALIFICATIONS = ['B.Pharm', 'M.Pharm', 'PharmD'];

interface Props {
  employer: Employer;
  jobPosting?: JobPosting;
  onSuccess: () => void;
}

export default function JobPostingForm({ employer, jobPosting, onSuccess }: Props) {
  const createJob = useCreateJobPosting();
  const updateJob = useUpdateJobPosting();
  const isEdit = !!jobPosting;

  const [form, setForm] = useState({
    title: '',
    specializations: [] as string[],
    qualifications: [] as string[],
    minExperience: '',
    maxExperience: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    skills: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobPosting) {
      setForm({
        title: jobPosting.title,
        specializations: jobPosting.specializations.split(',').map(s => s.trim()).filter(Boolean),
        qualifications: jobPosting.qualifications.split(',').map(s => s.trim()).filter(Boolean),
        minExperience: String(Number(jobPosting.minExperience)),
        maxExperience: String(Number(jobPosting.maxExperience)),
        location: jobPosting.location,
        salaryMin: String(Number(jobPosting.salaryMin)),
        salaryMax: String(Number(jobPosting.salaryMax)),
        description: jobPosting.description,
        skills: jobPosting.skills,
      });
    }
  }, [jobPosting]);

  const toggleItem = (field: 'specializations' | 'qualifications', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Job title is required';
    if (form.specializations.length === 0) newErrors.specializations = 'Select at least one specialization';
    if (form.qualifications.length === 0) newErrors.qualifications = 'Select at least one qualification';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.description.trim()) newErrors.description = 'Job description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      specializations: form.specializations.join(', '),
      qualifications: form.qualifications.join(', '),
      minExperience: BigInt(parseInt(form.minExperience) || 0),
      maxExperience: BigInt(parseInt(form.maxExperience) || 0),
      location: form.location.trim(),
      salaryMin: BigInt(parseInt(form.salaryMin) || 0),
      salaryMax: BigInt(parseInt(form.salaryMax) || 0),
      description: form.description.trim(),
      skills: form.skills.trim(),
    };

    try {
      if (isEdit && jobPosting) {
        await updateJob.mutateAsync({ id: jobPosting.id, ...payload });
        toast.success('Job posting updated!');
      } else {
        await createJob.mutateAsync({ employerId: employer.id, ...payload });
        toast.success('Job posting created!');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save job posting');
    }
  };

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div className="space-y-1.5">
            <Label>Job Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => {
                setForm(p => ({ ...p, title: e.target.value }));
                setErrors(p => ({ ...p, title: '' }));
              }}
              placeholder="Senior Retail Pharmacist"
            />
            {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
          </div>

          {/* Specializations */}
          <div className="space-y-2">
            <Label>Required Specializations *</Label>
            <div className="flex flex-wrap gap-4">
              {SPECIALIZATIONS.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.specializations.includes(s)}
                    onCheckedChange={() => toggleItem('specializations', s)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
            {errors.specializations && <p className="text-destructive text-xs">{errors.specializations}</p>}
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <Label>Required Qualifications *</Label>
            <div className="flex flex-wrap gap-4">
              {QUALIFICATIONS.map(q => (
                <label key={q} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.qualifications.includes(q)}
                    onCheckedChange={() => toggleItem('qualifications', q)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm">{q}</span>
                </label>
              ))}
            </div>
            {errors.qualifications && <p className="text-destructive text-xs">{errors.qualifications}</p>}
          </div>

          {/* Experience & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Min Experience (years)</Label>
              <Input
                type="number"
                min="0"
                value={form.minExperience}
                onChange={(e) => setForm(p => ({ ...p, minExperience: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Experience (years)</Label>
              <Input
                type="number"
                min="0"
                value={form.maxExperience}
                onChange={(e) => setForm(p => ({ ...p, maxExperience: e.target.value }))}
                placeholder="10"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Location *</Label>
              <Input
                value={form.location}
                onChange={(e) => {
                  setForm(p => ({ ...p, location: e.target.value }));
                  setErrors(p => ({ ...p, location: '' }));
                }}
                placeholder="Mumbai, Maharashtra"
              />
              {errors.location && <p className="text-destructive text-xs">{errors.location}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Skills <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input
                value={form.skills}
                onChange={(e) => setForm(p => ({ ...p, skills: e.target.value }))}
                placeholder="Drug dispensing, Patient care"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Salary Min (₹/year)</Label>
              <Input
                type="number"
                min="0"
                value={form.salaryMin}
                onChange={(e) => setForm(p => ({ ...p, salaryMin: e.target.value }))}
                placeholder="300000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Salary Max (₹/year)</Label>
              <Input
                type="number"
                min="0"
                value={form.salaryMax}
                onChange={(e) => setForm(p => ({ ...p, salaryMax: e.target.value }))}
                placeholder="700000"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Job Description *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => {
                setForm(p => ({ ...p, description: e.target.value }));
                setErrors(p => ({ ...p, description: '' }));
              }}
              placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              rows={5}
            />
            {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
          </div>

          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isEdit ? 'Updating...' : 'Creating...'}</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> {isEdit ? 'Update Job Posting' : 'Create Job Posting'}</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
