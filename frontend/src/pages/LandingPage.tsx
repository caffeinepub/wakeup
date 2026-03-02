import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search, Briefcase, User, FileText,
  TrendingUp, Shield, Building2, ArrowRight
} from 'lucide-react';

const SPECIALIZATIONS = [
  { label: 'Retail Pharmacist', icon: '🏪', count: '2,400+' },
  { label: 'Hospital Pharmacist', icon: '🏥', count: '1,800+' },
  { label: 'Clinical Pharmacist', icon: '🔬', count: '950+' },
];

const CANDIDATE_BENEFITS = [
  { icon: <FileText className="w-5 h-5" />, title: 'Easy Profile Creation', desc: 'Build a comprehensive pharmacy profile in minutes' },
  { icon: <Search className="w-5 h-5" />, title: 'Smart Job Matching', desc: 'Get matched with jobs that fit your specialization' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Career Growth', desc: 'Access opportunities across retail, hospital & clinical sectors' },
];

const EMPLOYER_BENEFITS = [
  { icon: <Search className="w-5 h-5" />, title: 'PharmSearch Database', desc: 'Search thousands of verified pharmacist profiles instantly' },
  { icon: <Building2 className="w-5 h-5" />, title: 'Company Branding', desc: 'Showcase your organization to top pharmacy talent' },
  { icon: <Shield className="w-5 h-5" />, title: 'Verified Profiles', desc: 'Access candidates with verified qualifications and experience' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative min-h-[520px] flex items-center"
        style={{
          backgroundImage: `url('/assets/generated/hero-bg.dim_1440x600.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-coral-400 text-white border-0 text-sm px-3 py-1">
              #1 Pharmacy Job Portal in India
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Your Pharmacy Career
              <span className="block text-coral-300">Starts Here</span>
            </h1>
            <p className="text-teal-100 text-lg md:text-xl mb-8 leading-relaxed">
              Connecting Retail, Hospital & Clinical Pharmacists with top healthcare employers across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/jobs' })}
                className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-8 shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Jobs
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/candidate/register' })}
                className="border-white text-white hover:bg-white/10 font-semibold px-8"
              >
                <User className="w-5 h-5 mr-2" />
                Create Profile
              </Button>
              <Button
                size="lg"
                onClick={() => navigate({ to: '/employer/register' })}
                className="bg-coral-400 text-white hover:bg-coral-500 font-semibold px-8 shadow-lg"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Post Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {SPECIALIZATIONS.map((spec) => (
              <div key={spec.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{spec.icon}</span>
                <span className="font-display font-bold text-xl text-primary">{spec.count}</span>
                <span className="text-sm text-muted-foreground hidden sm:block">{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Candidates */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3 text-primary">For Pharmacists</Badge>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Advance Your Pharmacy Career
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of pharmacists who found their dream job through Wakeup.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {CANDIDATE_BENEFITS.map((b) => (
              <Card key={b.title} className="card-hover border-border shadow-card">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate({ to: '/candidate/register' })}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              Register as Candidate <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-16 bg-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-coral-400 text-white border-0">For Employers</Badge>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Find the Right Pharmacist
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Access India's largest pharmacy talent database with PharmSearch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {EMPLOYER_BENEFITS.map((b) => (
              <Card key={b.title} className="card-hover border-border shadow-card bg-white">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center text-coral-500 mb-4">
                    {b.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate({ to: '/employer/register' })}
              className="bg-coral-400 text-white hover:bg-coral-500 px-8"
            >
              Register as Employer <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">How Wakeup Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> For Candidates
              </h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Create your pharmacist profile with qualifications & experience' },
                  { step: '2', text: 'Upload your resume and set your profile to Active' },
                  { step: '3', text: 'Browse job listings and get discovered by employers' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    <p className="text-muted-foreground pt-0.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-coral-500 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> For Employers
              </h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Register your company and create an employer profile' },
                  { step: '2', text: 'Post job openings for pharmacist positions' },
                  { step: '3', text: 'Use PharmSearch to find and contact candidates directly' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-coral-400 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    <p className="text-muted-foreground pt-0.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Join Wakeup today — India's most trusted pharmacy job portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/candidate/register' })}
              className="bg-white text-teal-700 hover:bg-teal-50 font-semibold"
            >
              <User className="w-5 h-5 mr-2" /> I'm a Pharmacist
            </Button>
            <Button
              size="lg"
              onClick={() => navigate({ to: '/employer/register' })}
              className="bg-coral-400 text-white hover:bg-coral-500 font-semibold"
            >
              <Briefcase className="w-5 h-5 mr-2" /> I'm an Employer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
