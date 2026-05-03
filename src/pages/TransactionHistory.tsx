import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Gift, UserPlus, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: typeof Coins; label: string; color: string; bg: string }> = {
  withdrawal: { icon: ArrowUpRight, label: "Withdrawal", color: "text-red-400", bg: "bg-red-500/15" },
  referral_bonus: { icon: UserPlus, label: "Referral Bonus", color: "text-green-400", bg: "bg-green-500/15" },
  task_reward: { icon: Gift, label: "Task Reward", color: "text-green-400", bg: "bg-green-500/15" },
  bonus: { icon: Coins, label: "Bonus", color: "text-green-400", bg: "bg-green-500/15" },
};

const defaultType = { icon: Coins, label: "Transaction", color: "text-muted-foreground", bg: "bg-secondary" };

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const totalEarned = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalRedeemed = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // Group by date
  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, t) => {
    const key = formatDate(t.created_at);
    (acc[key] = acc[key] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-foreground">Transaction History</h1>
      </div>

      {/* Summary Cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft size={16} className="text-green-400" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Earned</p>
          </div>
          <p className="text-green-400 font-bold text-xl">{totalEarned} 🪙</p>
        </div>
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight size={16} className="text-red-400" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Redeemed</p>
          </div>
          <p className="text-red-400 font-bold text-xl">{totalRedeemed} 🪙</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 mt-5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <Coins size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No transactions yet</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txns]) => (
            <div key={date} className="mb-5">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">{date}</p>
              <div className="flex flex-col gap-2">
                {txns.map((t) => {
                  const config = typeConfig[t.type] || defaultType;
                  const Icon = config.icon;
                  const isNegative = t.amount < 0;
                  return (
                    <div key={t.id} className="bg-card rounded-xl p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                        <Icon size={20} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-semibold text-sm truncate">{config.label}</p>
                        <p className="text-muted-foreground text-xs truncate">{t.description || "—"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-sm ${isNegative ? "text-red-400" : "text-green-400"}`}>
                          {isNegative ? "" : "+"}{t.amount} 🪙
                        </p>
                        <p className="text-muted-foreground text-[10px]">{formatTime(t.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
