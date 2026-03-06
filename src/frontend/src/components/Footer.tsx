import { Heart } from "lucide-react";

function PharmacyCrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
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

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined"
      ? window.location.hostname
      : "idea-algo-pharma",
  );

  return (
    <footer className="bg-navy-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <PharmacyCrossIcon className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-primary">Idea</span>
                <span className="text-white"> Algo</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              India's premier pharmacy job portal connecting pharmacists with
              top healthcare employers across the country.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              For Candidates
            </h4>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li>
                <a
                  href="/candidate/register"
                  className="hover:text-white transition-colors hover:text-primary"
                >
                  Create Profile
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  className="hover:text-white transition-colors hover:text-primary"
                >
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="/candidate/dashboard"
                  className="hover:text-white transition-colors hover:text-primary"
                >
                  My Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li>
                <a
                  href="/employer/register"
                  className="hover:text-white transition-colors hover:text-primary"
                >
                  Post Jobs
                </a>
              </li>
              <li>
                <a
                  href="/employer/pharmsearch"
                  className="hover:text-white transition-colors hover:text-primary"
                >
                  PharmSearch
                </a>
              </li>
              <li>
                <a
                  href="/employer/dashboard"
                  className="hover:text-white transition-colors hover:text-primary"
                >
                  Employer Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>© {year} Idea Algo. Created and all rights reserved by Gilbert.</p>
          <div className="flex items-center gap-5">
            <p className="flex items-center gap-1.5">
              Built with{" "}
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors font-medium hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <a
              href="/admin"
              className="text-xs text-white/30 hover:text-white/70 transition-colors"
              data-ocid="footer.admin.link"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
