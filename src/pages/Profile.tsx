import { ArrowLeft, User, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const uid = "USR-84729-XK";

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col pb-20">
      <div className="p-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
          <User size={48} className="text-muted-foreground" />
        </div>
        <h1 className="text-foreground text-2xl font-bold mt-4">sanjeev</h1>
        <p className="text-muted-foreground text-sm mt-1">Member since April 2026</p>
      </div>

      {/* Info Cards */}
      <div className="px-4 mt-8 space-y-4">
        {/* UID */}
        <div className="bg-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">User ID</p>
            <p className="text-foreground font-bold text-base mt-1">{uid}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(uid)}
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Balance */}
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--gold-gradient)" }}
        >
          <p className="text-primary-foreground/70 text-xs uppercase tracking-wider font-semibold">Total Balance</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-primary-foreground">499</span>
            <span className="text-2xl">🪙</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-muted-foreground text-xs mt-1">Tasks Completed</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-muted-foreground text-xs mt-1">Referrals</p>
          </div>
        </div>

        {/* Email / Phone */}
        <div className="bg-card rounded-xl p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Email</p>
          <p className="text-foreground font-medium text-sm mt-1">sanjeev@example.com</p>
        </div>
        <div className="bg-card rounded-xl p-4">
          <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Phone</p>
          <p className="text-foreground font-medium text-sm mt-1">+91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
