import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileText,
  FlaskConical,
  Hospital,
  Search,
  Shield,
  Store,
  TrendingUp,
  User,
} from "lucide-react";

const SPECIALIZATIONS = [
  {
    icon: <Store className="w-6 h-6" />,
    label: "Retail Pharmacist",
    count: "2,400+",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: <Hospital className="w-6 h-6" />,
    label: "Hospital Pharmacist",
    count: "1,800+",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    label: "Clinical Pharmacist",
    count: "950+",
    color: "bg-purple-100 text-purple-700",
  },
];

const CANDIDATE_BENEFITS = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Easy Profile Creation",
    desc: "Build a comprehensive pharmacy profile in minutes — qualifications, experience, and specialization.",
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Smart Job Matching",
    desc: "Get matched with pharmacy roles that align with your specialization and location preferences.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Career Growth",
    desc: "Access opportunities across retail, hospital and clinical pharmacy sectors across India.",
  },
];

const EMPLOYER_BENEFITS = [
  {
    icon: <Search className="w-5 h-5" />,
    title: "PharmSearch Database",
    desc: "Search thousands of verified pharmacist profiles instantly using keywords and smart filters.",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    title: "Company Branding",
    desc: "Showcase your organisation to top pharmacy talent with a professional employer profile.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Verified Profiles",
    desc: "Access candidates with verified pharmacy qualifications, experience, and active profiles.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[560px] flex items-center hero-gradient overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,oklch(0.52_0.16_155/0.18)_0%,transparent_70%)]" />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[480px] h-[480px] opacity-[0.06] pointer-events-none"
        >
          <svg
            viewBox="0 0 200 200"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
          >
            <rect x="75" y="10" width="50" height="180" rx="8" />
            <rect x="10" y="75" width="180" height="50" rx="8" />
          </svg>
        </div>
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.04] pointer-events-none"
        >
          <svg
            viewBox="0 0 200 200"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
          >
            <circle cx="100" cy="100" r="90" />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="white"
              strokeWidth="4"
            />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <Badge className="mb-5 bg-white/15 text-white border-white/30 text-sm px-4 py-1 backdrop-blur-sm">
              #1 Pharmacy Job Portal in India
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Your Pharmacy Career
              <span className="block text-emerald-300">Starts Here</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              Connecting Retail, Hospital &amp; Clinical Pharmacists with top
              healthcare employers across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate({ to: "/jobs" })}
                className="bg-white text-navy-900 hover:bg-emerald-50 font-bold px-8 shadow-xl transition-all hover:scale-[1.02]"
                data-ocid="hero.find_jobs.button"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Jobs
              </Button>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/candidate/register" })}
                className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold px-8 bg-transparent transition-all hover:border-white"
                data-ocid="hero.create_profile.button"
              >
                <User className="w-5 h-5 mr-2" />
                Create Profile
              </Button>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/employer/register" })}
                className="bg-emerald-500 text-white hover:bg-emerald-400 font-semibold px-8 shadow-lg transition-all hover:scale-[1.02]"
                data-ocid="hero.post_jobs.button"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Post Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-border shadow-xs">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-border">
            {SPECIALIZATIONS.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-4"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${spec.color}`}
                >
                  {spec.icon}
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-display font-bold text-2xl text-foreground leading-none">
                    {spec.count}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {spec.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Candidates ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="mb-3 text-primary font-semibold px-4"
            >
              For Pharmacists
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Pharmacists
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Join thousands of pharmacists who found their dream job through
              Idea Algo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {CANDIDATE_BENEFITS.map((b, i) => (
              <Card
                key={b.title}
                className="card-hover border-l-4 border-l-primary border-border shadow-card"
                data-ocid={`candidate.benefits.card.${i + 1}`}
              >
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2 text-base">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate({ to: "/candidate/register" })}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-md"
              size="lg"
              data-ocid="candidate.register.button"
            >
              Register as Candidate <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── For Employers ── */}
      <section className="py-20 bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-white/15 text-white border-white/30 font-semibold px-4">
              For Employers
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Find the Right Pharmacist
            </h2>
            <p className="text-white/70 max-w-xl mx-auto text-base">
              Access India's largest pharmacy talent database with PharmSearch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {EMPLOYER_BENEFITS.map((b, i) => (
              <Card
                key={b.title}
                className="card-hover bg-white/10 border-white/20 text-white shadow-none"
                data-ocid={`employer.benefits.card.${i + 1}`}
              >
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-emerald-300 mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2 text-base">
                    {b.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {b.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate({ to: "/employer/register" })}
              className="bg-emerald-400 text-navy-900 hover:bg-emerald-300 font-bold px-8 shadow-lg transition-all hover:scale-[1.02]"
              size="lg"
              data-ocid="employer.register.button"
            >
              Register as Employer <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How Idea Algo Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Simple, fast, and built for the pharmacy industry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Candidates */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-primary mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                For Candidates
              </h3>
              <div className="space-y-5">
                {[
                  {
                    key: "c-step-1",
                    text: "Create your pharmacist profile with qualifications & experience",
                  },
                  {
                    key: "c-step-2",
                    text: "Upload your resume and set your profile to Active",
                  },
                  {
                    key: "c-step-3",
                    text: "Browse job listings and get discovered by employers",
                  },
                ].map(({ key, text }, idx) => (
                  <div key={key} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-muted-foreground pt-1 leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Employers */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <h3
                className="font-display font-bold text-lg mb-6 flex items-center gap-2"
                style={{ color: "oklch(0.35 0.14 255)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.35 0.14 255 / 0.1)" }}
                >
                  <Briefcase
                    className="w-4 h-4"
                    style={{ color: "oklch(0.35 0.14 255)" }}
                  />
                </div>
                For Employers
              </h3>
              <div className="space-y-5">
                {[
                  {
                    key: "e-step-1",
                    text: "Register your company and create an employer profile",
                  },
                  {
                    key: "e-step-2",
                    text: "Post job openings for pharmacist positions",
                  },
                  {
                    key: "e-step-3",
                    text: "Use PharmSearch to find and contact candidates directly",
                  },
                ].map(({ key, text }, idx) => (
                  <div key={key} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-muted-foreground pt-1 leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.52_0.16_155/0.15)_0%,transparent_70%)]" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-10 max-w-lg mx-auto text-base">
            Join Idea Algo today — India's most trusted pharmacy job portal for
            Retail, Hospital &amp; Clinical pharmacists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: "/candidate/register" })}
              className="bg-white text-navy-900 hover:bg-emerald-50 font-bold px-8 shadow-xl transition-all hover:scale-[1.02]"
              data-ocid="cta.candidate.button"
            >
              <User className="w-5 h-5 mr-2" /> I'm a Pharmacist
            </Button>
            <Button
              size="lg"
              onClick={() => navigate({ to: "/employer/register" })}
              className="bg-emerald-500 text-white hover:bg-emerald-400 font-semibold px-8 shadow-lg transition-all hover:scale-[1.02]"
              data-ocid="cta.employer.button"
            >
              <Briefcase className="w-5 h-5 mr-2" /> I'm an Employer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
