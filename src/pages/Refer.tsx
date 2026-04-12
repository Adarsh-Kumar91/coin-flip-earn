import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Copy, Users, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Refer = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, earned: 0 });

  const referralCode = profile?.referral_code || "...";
  const shareUrl = `${window.location.origin}/auth?ref=${referralCode}`;

  useEffect(() => {
    if (!user) return;
    const fetchReferrals = async () => {
      const { data } = await supabase
        .from("referrals")
        .select("*, referred:profiles!referrals_referred_id_fkey(display_name)")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setReferrals(data);
        const completed = data.filter((r: any) => r.status === "completed").length;
        const pending = data.filter((r: any) => r.status === "pending").length;
        setStats({ total: data.length, pending, earned: completed * 200 });
      }
    };
    fetchReferrals();
  }, [user]);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users size={24} className="text-primary" />
          Refer & Earn
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Invite friends and earn coins together</p>
      </div>

      <div className="px-4">
        <div className="rounded-xl p-5 text-center" style={{ background: "var(--gold-gradient)" }}>
          <p className="text-primary-foreground/80 text-sm font-medium">Earn per referral</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-4xl font-bold text-primary-foreground">200</span>
            <span className="text-3xl">🪙</span>
          </div>
          <p className="text-primary-foreground/70 text-xs mt-2">Your friend also gets 100 coins!</p>
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="bg-card rounded-xl p-5">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2">Your Referral Link</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-secondary rounded-lg px-4 py-3 text-foreground font-bold text-xs tracking-wider text-center break-all">
              {shareUrl}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); toast({ title: "Link copied!" }); }}
              className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <button
          className="w-full py-4 rounded-xl font-bold text-lg text-primary-foreground flex items-center justify-center gap-2"
          style={{ background: "var(--gold-gradient)" }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Join & Earn!", text: `Use my referral link to get 100 bonus coins!`, url: shareUrl });
            } else {
              navigator.clipboard.writeText(shareUrl);
              toast({ title: "Link copied to clipboard!" });
            }
          }}
        >
          <Share2 size={20} />
          Share with Friends
        </button>
      </div>

      <div className="px-4 mt-5">
        <h2 className="text-foreground font-bold text-lg mb-3">Your Referrals</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-primary">{stats.total}</p>
            <p className="text-muted-foreground text-[10px] mt-1">Total Referrals</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-foreground">{stats.pending}</p>
            <p className="text-muted-foreground text-[10px] mt-1">Pending</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-xl font-bold text-primary">{stats.earned}</p>
              <span>🪙</span>
            </div>
            <p className="text-muted-foreground text-[10px] mt-1">Earned</p>
          </div>
        </div>
      </div>

      {referrals.length > 0 && (
        <div className="px-4 mt-5">
          <h2 className="text-foreground font-bold text-lg mb-3">Recent</h2>
          {referrals.map((ref, i) => (
            <div key={i} className="bg-card rounded-xl p-4 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-sm">
                  {(ref.referred?.display_name || "U").charAt(0)}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{ref.referred?.display_name || "User"}</p>
                  <p className={`text-xs ${ref.status === "completed" ? "text-primary" : "text-muted-foreground"}`}>{ref.status === "completed" ? "Completed" : "Pending"}</p>
                </div>
              </div>
              {ref.status === "completed" && (
                <span className="text-primary font-bold text-sm">+200 🪙</span>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Refer;
