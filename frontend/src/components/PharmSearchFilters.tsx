import type { SearchFilters } from '../pages/PharmSearchPage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

const SPECIALIZATIONS = ['Retail Pharmacist', 'Hospital Pharmacist', 'Clinical Pharmacist'];
const QUALIFICATIONS = ['B.Pharm', 'M.Pharm', 'PharmD'];

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export default function PharmSearchFilters({ filters, onChange }: Props) {
  const handleReset = () => {
    onChange({
      keywords: '',
      specialization: null,
      qualification: null,
      minExperience: null,
      maxExperience: null,
      location: null,
    });
  };

  const hasActiveFilters =
    filters.keywords ||
    filters.specialization ||
    filters.qualification ||
    filters.minExperience !== null ||
    filters.maxExperience !== null ||
    filters.location;

  return (
    <Card className="shadow-card border-border sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
            >
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keyword Search */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Keywords</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={filters.keywords}
              onChange={(e) => onChange({ ...filters, keywords: e.target.value })}
              placeholder="Name, skills, bio..."
              className="pl-8 text-sm"
            />
          </div>
        </div>

        {/* Specialization */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Specialization</Label>
          <Select
            value={filters.specialization ?? 'all'}
            onValueChange={(v) => onChange({ ...filters, specialization: v === 'all' ? null : v })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {SPECIALIZATIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Qualification */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Qualification</Label>
          <Select
            value={filters.qualification ?? 'all'}
            onValueChange={(v) => onChange({ ...filters, qualification: v === 'all' ? null : v })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All qualifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualifications</SelectItem>
              {QUALIFICATIONS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Range */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Experience (years)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              className="text-sm"
              value={filters.minExperience !== null ? String(Number(filters.minExperience)) : ''}
              onChange={(e) => onChange({
                ...filters,
                minExperience: e.target.value ? BigInt(parseInt(e.target.value)) : null,
              })}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              className="text-sm"
              value={filters.maxExperience !== null ? String(Number(filters.maxExperience)) : ''}
              onChange={(e) => onChange({
                ...filters,
                maxExperience: e.target.value ? BigInt(parseInt(e.target.value)) : null,
              })}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</Label>
          <Input
            value={filters.location ?? ''}
            onChange={(e) => onChange({ ...filters, location: e.target.value || null })}
            placeholder="City or state"
            className="text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
