import BottomNav from "@/components/BottomNav";
import { Gift, ArrowRight } from "lucide-react";

const rewards = [
  { id: 1, name: "₹50 Paytm Cash", coins: 500, icon: "💰" },
  { id: 2, name: "₹100 Amazon Voucher", coins: 1000, icon: "🛒" },
  { id: 3, name: "₹200 Flipkart Voucher", coins: 2000, icon: "🎁" },
  { id: 4, name: "₹50 Mobile Recharge", coins: 500, icon: "📱" },
  { id: 5, name: "₹500 Amazon Voucher", coins: 5000, icon: "🏆" },
];

const Rewards = () => {
  const balance = 499;

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gift size={24} className="text-primary" />
          Rewards
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Redeem your coins for exciting rewards</p>
      </div>

      {/* Balance */}
      <div className="px-4">
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: "var(--gold-gradient)" }}
        >
          <p className="text-primary-foreground/80 text-sm font-medium">Available Balance</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-4xl font-bold text-primary-foreground">{balance}</span>
            <span className="text-3xl">🪙</span>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      <div className="px-4 mt-5">
        <h2 className="text-foreground font-bold text-lg mb-3">Available Rewards</h2>
        <div className="flex flex-col gap-3">
          {rewards.map((reward) => {
            const canRedeem = balance >= reward.coins;
            return (
              <div key={reward.id} className="bg-card rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {reward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-bold text-sm">{reward.name}</h3>
                  <p className="text-primary text-xs font-semibold mt-0.5">{reward.coins} 🪙</p>
                </div>
                <button
                  disabled={!canRedeem}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-transform active:scale-95 ${
                    canRedeem
                      ? "text-primary-foreground"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                  style={canRedeem ? { background: "var(--gold-gradient)" } : undefined}
                >
                  Redeem
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div className="px-4 mt-6">
        <h2 className="text-foreground font-bold text-lg mb-3">Redemption History</h2>
        <div className="bg-card rounded-xl p-5 text-center">
          <p className="text-muted-foreground text-sm">No redemptions yet</p>
          <p className="text-muted-foreground text-xs mt-1">Complete tasks to earn more coins!</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Rewards;
