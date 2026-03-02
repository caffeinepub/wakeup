import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'wakeup-pharma');

  return (
    <footer className="bg-teal-700 text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img
              src="/assets/generated/wakeup-logo.dim_320x80.png"
              alt="Wakeup"
              className="h-8 w-auto object-contain mb-3 brightness-0 invert"
            />
            <p className="text-teal-100 text-sm leading-relaxed">
              India's premier pharmacy job portal connecting pharmacists with top healthcare employers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">For Candidates</h4>
            <ul className="space-y-2 text-teal-100 text-sm">
              <li><a href="/candidate/register" className="hover:text-white transition-colors">Create Profile</a></li>
              <li><a href="/jobs" className="hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="/candidate/dashboard" className="hover:text-white transition-colors">My Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">For Employers</h4>
            <ul className="space-y-2 text-teal-100 text-sm">
              <li><a href="/employer/register" className="hover:text-white transition-colors">Post Jobs</a></li>
              <li><a href="/employer/pharmsearch" className="hover:text-white transition-colors">PharmSearch</a></li>
              <li><a href="/employer/dashboard" className="hover:text-white transition-colors">Employer Dashboard</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-teal-600 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-teal-200">
          <p>© {year} Wakeup. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-coral-400 fill-coral-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
