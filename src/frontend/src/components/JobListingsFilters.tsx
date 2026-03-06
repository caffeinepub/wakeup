import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { JobFilters } from "../pages/PublicJobListingsPage";

const SPECIALIZATIONS = [
  "Retail Pharmacist",
  "Hospital Pharmacist",
  "Clinical Pharmacist",
];

interface Props {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}

export default function JobListingsFilters({ filters, onChange }: Props) {
  const handleReset = () => {
    onChange({
      specialization: null,
      location: "",
      minExperience: "",
      maxExperience: "",
    });
  };

  const hasActiveFilters =
    filters.specialization ||
    filters.location ||
    filters.minExperience ||
    filters.maxExperience;

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
        {/* Specialization */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Specialization
          </Label>
          <Select
            value={filters.specialization ?? "all"}
            onValueChange={(v) =>
              onChange({ ...filters, specialization: v === "all" ? null : v })
            }
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {SPECIALIZATIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Location
          </Label>
          <Input
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            placeholder="City or state"
            className="text-sm"
          />
        </div>

        {/* Experience Range */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Experience (years)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              className="text-sm"
              value={filters.minExperience}
              onChange={(e) =>
                onChange({ ...filters, minExperience: e.target.value })
              }
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              className="text-sm"
              value={filters.maxExperience}
              onChange={(e) =>
                onChange({ ...filters, maxExperience: e.target.value })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
