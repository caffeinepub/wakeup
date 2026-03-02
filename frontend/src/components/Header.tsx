import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Briefcase, User, Search } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();

  const isEmployer = userProfile?.role === 'employer';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src="/assets/generated/wakeup-logo.dim_320x80.png"
            alt="Wakeup Logo"
            className="h-9 w-auto object-contain"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Show Browse Jobs for candidates/guests; Browse Candidates for employers */}
          {isEmployer ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/employer/pharmsearch' })}
              className="text-foreground hover:text-primary hover:bg-secondary font-medium"
            >
              <Search className="w-4 h-4 mr-1" />
              Browse Candidates
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/jobs' })}
              className="text-foreground hover:text-primary hover:bg-secondary font-medium"
            >
              Browse Jobs
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/candidate/dashboard' })}
                className="text-foreground hover:text-primary hover:bg-secondary font-medium"
              >
                <User className="w-4 h-4 mr-1" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/employer/dashboard' })}
                className="text-foreground hover:text-primary hover:bg-secondary font-medium"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Employer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-border text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/candidate/register' })}
                className="border-primary text-primary hover:bg-secondary font-medium"
              >
                <User className="w-4 h-4 mr-1" />
                Candidate Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate({ to: '/employer/register' })}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Employer Login
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
          {/* Show Browse Jobs for candidates/guests; Browse Candidates for employers */}
          {isEmployer ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { navigate({ to: '/employer/pharmsearch' }); setMobileOpen(false); }}
              className="justify-start"
            >
              <Search className="w-4 h-4 mr-1" /> Browse Candidates
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { navigate({ to: '/jobs' }); setMobileOpen(false); }}
              className="justify-start"
            >
              Browse Jobs
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate({ to: '/candidate/dashboard' }); setMobileOpen(false); }}
                className="justify-start"
              >
                <User className="w-4 h-4 mr-1" /> My Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate({ to: '/employer/dashboard' }); setMobileOpen(false); }}
                className="justify-start"
              >
                <Briefcase className="w-4 h-4 mr-1" /> Employer Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="justify-start text-destructive"
              >
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { navigate({ to: '/candidate/register' }); setMobileOpen(false); }}
                className="justify-start border-primary text-primary"
              >
                <User className="w-4 h-4 mr-1" /> Candidate Login
              </Button>
              <Button
                size="sm"
                onClick={() => { navigate({ to: '/employer/register' }); setMobileOpen(false); }}
                className="justify-start bg-primary text-primary-foreground"
              >
                <Briefcase className="w-4 h-4 mr-1" /> Employer Login
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
