import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ADMIN_EMAIL = "gilbertzota@gmail.com";
const ADMIN_PASSWORD = "#Zota@123";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isAlreadyLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("admin_session") === "true";

  useEffect(() => {
    if (isAlreadyLoggedIn) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAlreadyLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_session", "true");
      toast.success("Welcome, Admin!");
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.error("Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            <span className="text-primary">Idea</span>
            <span className="text-navy-400"> Algo</span>
            <span className="text-muted-foreground font-normal text-lg ml-2">
              Admin
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Secure administrator access
          </p>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Enter your administrator credentials to access the control panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  data-ocid="admin.login.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  data-ocid="admin.password.input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={isLoading}
                data-ocid="admin.submit.button"
              >
                {isLoading ? "Verifying..." : "Login to Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Restricted access. Unauthorized entry is prohibited.
        </p>
      </div>
    </div>
  );
}
