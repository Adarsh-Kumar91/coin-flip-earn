import { useState, useEffect } from "react";
import { ArrowLeft, User, Copy, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col pb-20">
      <div className="p-4 pt-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
          <User size={48} className="text-muted-foreground" />
        </div>
        <h1 className="text-foreground text-2xl font-bold mt-4">{profile?.display_name}</h1>
        <p className="text-muted-foreground text-sm mt-1">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</p>
      </div>

      <div className="px-4 mt-8 space-y-4">
        <div className="bg-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Referral Code</p>
            <p className="text-foreground font-bold text-base mt-1">{profile?.referral_code}</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(profile?.referral_code || ""); toast({ title: "Copied!" }); }}
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="rounded-xl p-5" style={{ background: "var(--gold-gradient)" }}>
          <p className="text-primary-foreground/70 text-xs uppercase tracking-wider font-semibold">Total Balance</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-primary-foreground">{profile?.balance || 0}</span>
            <span className="text-2xl">🪙</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{profile?.tasks_completed || 0}</p>
            <p className="text-muted-foreground text-xs mt-1">Tasks Completed</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">-</p>
            <p className="text-muted-foreground text-xs mt-1">Referrals</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Email</p>
          <p className="text-foreground font-medium text-sm mt-1">{profile?.email}</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate("/admin/tasks")}
            className="bg-card rounded-xl p-4 flex items-center gap-3 w-full active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-foreground font-bold text-sm">Manage Tasks</p>
              <p className="text-muted-foreground text-xs">Add, edit or delete task offers</p>
            </div>
            <ArrowLeft size={16} className="text-muted-foreground ml-auto rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
