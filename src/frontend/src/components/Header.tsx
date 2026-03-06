import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, LogOut, Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

function PharmacyCrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Pharmacy cross"
      role="img"
    >
      <title>Pharmacy cross</title>
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();

  const isEmployer = userProfile?.role === "employer";
  const isCandidate = userProfile?.role === "candidate";

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
        >
          <PharmacyCrossIcon className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-primary">Idea</span>
            <span className="text-navy-700"> Algo</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {/* Role-specific nav */}
              {isEmployer && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.link"
                    onClick={() => navigate({ to: "/employer/dashboard" })}
                    className="text-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-md"
                  >
                    <Briefcase className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.link"
                    onClick={() => navigate({ to: "/employer/pharmsearch" })}
                    className="text-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-md"
                  >
                    <Search className="w-4 h-4 mr-1.5" />
                    Browse Candidates
                  </Button>
                </>
              )}
              {isCandidate && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.link"
                    onClick={() => navigate({ to: "/candidate/dashboard" })}
                    className="text-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-md"
                  >
                    <User className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.link"
                    onClick={() => navigate({ to: "/jobs" })}
                    className="text-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-md"
                  >
                    Browse Jobs
                  </Button>
                </>
              )}
              {!isEmployer && !isCandidate && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.link"
                    onClick={() => navigate({ to: "/jobs" })}
                    className="text-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-md"
                  >
                    Browse Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid="nav.link"
                    onClick={() => navigate({ to: "/candidate/dashboard" })}
                    className="text-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-md"
                  >
                    <User className="w-4 h-4 mr-1.5" />
                    My Profile
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                data-ocid="nav.button"
                onClick={handleLogout}
                className="ml-1 border-border text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                data-ocid="nav.link"
                onClick={() => navigate({ to: "/jobs" })}
                className="text-foreground hover:text-primary hover:bg-primary/10 font-medium"
              >
                Find Jobs
              </Button>
              <Button
                variant="outline"
                size="sm"
                data-ocid="nav.link"
                onClick={() => navigate({ to: "/candidate/register" })}
                className="border-primary text-primary hover:bg-primary/10 font-medium ml-1"
              >
                <User className="w-4 h-4 mr-1.5" />
                Candidate Login
              </Button>
              <Button
                size="sm"
                data-ocid="nav.link"
                onClick={() => navigate({ to: "/employer/register" })}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium ml-1"
              >
                <Briefcase className="w-4 h-4 mr-1.5" />
                Employer Login
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              {isEmployer && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: "/employer/dashboard" });
                      setMobileOpen(false);
                    }}
                    className="justify-start"
                  >
                    <Briefcase className="w-4 h-4 mr-2" /> Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: "/employer/pharmsearch" });
                      setMobileOpen(false);
                    }}
                    className="justify-start"
                  >
                    <Search className="w-4 h-4 mr-2" /> Browse Candidates
                  </Button>
                </>
              )}
              {isCandidate && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: "/candidate/dashboard" });
                      setMobileOpen(false);
                    }}
                    className="justify-start"
                  >
                    <User className="w-4 h-4 mr-2" /> Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: "/jobs" });
                      setMobileOpen(false);
                    }}
                    className="justify-start"
                  >
                    Browse Jobs
                  </Button>
                </>
              )}
              {!isEmployer && !isCandidate && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: "/jobs" });
                      setMobileOpen(false);
                    }}
                    className="justify-start"
                  >
                    Browse Jobs
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({ to: "/candidate/dashboard" });
                      setMobileOpen(false);
                    }}
                    className="justify-start"
                  >
                    <User className="w-4 h-4 mr-2" /> My Profile
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="justify-start text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate({ to: "/jobs" });
                  setMobileOpen(false);
                }}
                className="justify-start"
              >
                Find Jobs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate({ to: "/candidate/register" });
                  setMobileOpen(false);
                }}
                className="justify-start border-primary text-primary"
              >
                <User className="w-4 h-4 mr-2" /> Candidate Login
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  navigate({ to: "/employer/register" });
                  setMobileOpen(false);
                }}
                className="justify-start bg-primary text-primary-foreground"
              >
                <Briefcase className="w-4 h-4 mr-2" /> Employer Login
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
