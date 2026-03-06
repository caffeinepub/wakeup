import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Building2, LogOut, Shield, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  useGetAllActiveJobPostings,
  useGetEmployerById,
  useSearchCandidates,
} from "../hooks/useQueries";
import formatINR from "../utils/formatINR";

// Sub-component that fetches employer name for a job posting row
function EmployerCell({ employerId }: { employerId: bigint }) {
  const { data: employer } = useGetEmployerById(employerId);
  return <span>{employer?.companyName ?? "—"}</span>;
}

// Employer row using data derived from job postings
function EmployerRow({
  employerId,
  index,
}: {
  employerId: bigint;
  index: number;
}) {
  const { data: employer, isLoading } = useGetEmployerById(employerId);

  if (isLoading) {
    return (
      <TableRow data-ocid={`admin.employers.row.${index}`}>
        <TableCell colSpan={7}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      </TableRow>
    );
  }

  if (!employer) return null;

  return (
    <TableRow data-ocid={`admin.employers.row.${index}`}>
      <TableCell className="font-medium">{employer.companyName}</TableCell>
      <TableCell>{employer.industry}</TableCell>
      <TableCell>{employer.location}</TableCell>
      <TableCell>{employer.contactName}</TableCell>
      <TableCell>{employer.email}</TableCell>
      <TableCell>{employer.phone}</TableCell>
      <TableCell>
        {employer.website ? (
          <a
            href={employer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs"
          >
            {employer.website}
          </a>
        ) : (
          "—"
        )}
      </TableCell>
    </TableRow>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session !== "true") {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const { data: candidates, isLoading: candidatesLoading } =
    useSearchCandidates({
      keywords: "",
      specialization: null,
      qualification: null,
      minExperience: null,
      maxExperience: null,
      location: null,
    });

  const { data: jobPostings, isLoading: jobsLoading } =
    useGetAllActiveJobPostings();

  // Derive unique employer IDs from job postings
  const uniqueEmployerIds = useMemo(() => {
    if (!jobPostings) return [];
    const seen = new Set<string>();
    const ids: bigint[] = [];
    for (const job of jobPostings) {
      const key = job.employerId.toString();
      if (!seen.has(key)) {
        seen.add(key);
        ids.push(job.employerId);
      }
    }
    return ids;
  }, [jobPostings]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    navigate({ to: "/" });
  };

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-7xl"
      data-ocid="admin.dashboard.page"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Idea Algo — Full Control Panel
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground self-start sm:self-auto"
          data-ocid="admin.logout.button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-card border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                Total Candidates
              </p>
              {candidatesLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <p className="font-display text-2xl font-bold text-foreground">
                  {candidates?.length ?? 0}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-navy-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                Total Employers
              </p>
              {jobsLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <p className="font-display text-2xl font-bold text-foreground">
                  {uniqueEmployerIds.length}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                Active Job Postings
              </p>
              {jobsLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <p className="font-display text-2xl font-bold text-foreground">
                  {jobPostings?.length ?? 0}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="candidates">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger
            value="candidates"
            className="flex items-center gap-1.5"
            data-ocid="admin.tab.candidates"
          >
            <Users className="w-4 h-4" />
            Candidates
            {candidates && (
              <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                {candidates.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="employers"
            className="flex items-center gap-1.5"
            data-ocid="admin.tab.employers"
          >
            <Building2 className="w-4 h-4" />
            Employers
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="flex items-center gap-1.5"
            data-ocid="admin.tab.jobs"
          >
            <Briefcase className="w-4 h-4" />
            Job Postings
            {jobPostings && (
              <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                {jobPostings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> All Candidates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {candidatesLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : !candidates || candidates.length === 0 ? (
                <div
                  className="p-10 text-center text-muted-foreground"
                  data-ocid="admin.candidates.empty_state"
                >
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No candidates found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.candidates.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Qualification</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Expected Salary</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((c, i) => (
                        <TableRow
                          key={c.id.toString()}
                          data-ocid={`admin.candidates.row.${i + 1}`}
                        >
                          <TableCell className="font-medium whitespace-nowrap">
                            {c.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {c.specialization}
                            </Badge>
                          </TableCell>
                          <TableCell>{c.qualification}</TableCell>
                          <TableCell>{c.location}</TableCell>
                          <TableCell>
                            {Number(c.yearsOfExperience)} yrs
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatINR(Number(c.expectedSalary))}/yr
                          </TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                c.isProfileActive ? "default" : "secondary"
                              }
                              className={
                                c.isProfileActive
                                  ? "bg-primary text-primary-foreground text-xs"
                                  : "text-xs"
                              }
                            >
                              {c.isProfileActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employers Tab */}
        <TabsContent value="employers">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-navy-500" /> All Employers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {jobsLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : uniqueEmployerIds.length === 0 ? (
                <div
                  className="p-10 text-center text-muted-foreground"
                  data-ocid="admin.employers.empty_state"
                >
                  <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>
                    No employers found. Employers appear once they post jobs.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.employers.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Website</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueEmployerIds.map((id, i) => (
                        <EmployerRow
                          key={id.toString()}
                          employerId={id}
                          index={i + 1}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Postings Tab */}
        <TabsContent value="jobs">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" /> All Job Postings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {jobsLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : !jobPostings || jobPostings.length === 0 ? (
                <div
                  className="p-10 text-center text-muted-foreground"
                  data-ocid="admin.jobs.empty_state"
                >
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No active job postings found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.jobs.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Employer</TableHead>
                        <TableHead>Specializations</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Salary Range</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobPostings.map((job, i) => (
                        <TableRow
                          key={job.id.toString()}
                          data-ocid={`admin.jobs.row.${i + 1}`}
                        >
                          <TableCell className="font-medium whitespace-nowrap">
                            {job.title}
                          </TableCell>
                          <TableCell>
                            <EmployerCell employerId={job.employerId} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {job.specializations
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map((s) => (
                                  <Badge
                                    key={s}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {s}
                                  </Badge>
                                ))}
                            </div>
                          </TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatINR(Number(job.salaryMin))} –{" "}
                            {formatINR(Number(job.salaryMax))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {new Date(
                              Number(job.postedAt) / 1_000_000,
                            ).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={job.isActive ? "default" : "secondary"}
                              className={
                                job.isActive
                                  ? "bg-primary text-primary-foreground text-xs"
                                  : "text-xs"
                              }
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
