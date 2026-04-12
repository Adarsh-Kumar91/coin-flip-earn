import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Pre-fill referral code from URL
  const urlRef = searchParams.get("ref") || "";
  if (urlRef && !referralCode) {
    setReferralCode(urlRef);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login successful! 🎉" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              referred_by: referralCode || undefined,
            },
          },
        });
        if (error) throw error;
        toast({ title: "Account created! 🎉", description: referralCode ? "You got 100 bonus coins!" : undefined });
        navigate("/");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--gold-gradient)" }}>
            <Zap size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">TaskCoins</h1>
          <p className="text-muted-foreground text-sm mt-1">Earn coins, refer friends, withdraw cash</p>
        </div>

        <div className="bg-card rounded-2xl p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? "text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
              style={isLogin ? { background: "var(--gold-gradient)" } : undefined}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? "text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
              style={!isLogin ? { background: "var(--gold-gradient)" } : undefined}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1 block">Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  required={!isLogin}
                  className="bg-secondary border-0"
                />
              </div>
            )}
            <div>
              <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-secondary border-0"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-secondary border-0"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1 block">Referral Code (optional)</label>
                <Input
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. SANJEEV-a1b2"
                  className="bg-secondary border-0"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-lg text-primary-foreground disabled:opacity-50"
              style={{ background: "var(--gold-gradient)" }}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
