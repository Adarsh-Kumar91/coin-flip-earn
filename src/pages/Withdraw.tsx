import { ArrowLeft, Banknote, Smartphone, CreditCard } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const methods = [
  { id: "upi", label: "UPI", icon: Smartphone, placeholder: "Enter UPI ID (e.g. name@upi)" },
  { id: "bank", label: "Bank Transfer", icon: CreditCard, placeholder: "Enter Account Number" },
  { id: "paytm", label: "Paytm Wallet", icon: Banknote, placeholder: "Enter Paytm Number" },
];

const Withdraw = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rewardName = searchParams.get("reward") || "Reward";
  const rewardCoins = Number(searchParams.get("coins") || 0);
  const { profile, refreshProfile } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [accountDetail, setAccountDetail] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!accountDetail.trim()) {
      toast({ title: "Error", description: "Please enter your account details", variant: "destructive" });
      return;
    }
    if (!profile || profile.balance < rewardCoins) {
      toast({ title: "Insufficient Coins", description: "You don't have enough coins for this reward", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Deduct coins from balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: profile.balance - rewardCoins })
        .eq("user_id", profile.user_id);

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from("transactions").insert({
        user_id: profile.user_id,
        type: "withdrawal",
        amount: -rewardCoins,
        description: `Redeemed ${rewardName} via ${methods.find(m => m.id === selectedMethod)?.label}`,
      });

      // Notify admin via Telegram
      await supabase.functions.invoke("notify-withdrawal", {
        body: {
          userName: profile.display_name,
          userEmail: profile.email,
          userPhone: profile.phone,
          userId: profile.user_id,
          reward: rewardName,
          coins: rewardCoins,
          method: selectedMethod,
          methodLabel: methods.find(m => m.id === selectedMethod)?.label,
          accountDetail: accountDetail.trim(),
          ifsc: selectedMethod === "bank" ? ifsc.trim() : undefined,
          remainingBalance: profile.balance - rewardCoins,
        },
      }).catch(err => console.error("Telegram notify error:", err));

      // Refresh profile to update balance everywhere
      await refreshProfile?.();
      setSubmitted(true);
      toast({ title: "Withdrawal Requested! ✅", description: `${rewardName} will be sent to your ${methods.find(m => m.id === selectedMethod)?.label} shortly.` });
    } catch (err) {
      console.error("Withdrawal error:", err);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-foreground">Withdrawal Submitted!</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Your <span className="font-semibold text-foreground">{rewardName}</span> will be sent to your account within 24-48 hours.
        </p>
        <button
          onClick={() => navigate("/rewards")}
          className="mt-6 px-6 py-3 rounded-xl text-primary-foreground font-bold"
          style={{ background: "var(--gold-gradient)" }}
        >
          Back to Rewards
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      <div className="p-4 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-foreground">Withdraw</h1>
      </div>

      {/* Reward Info */}
      <div className="px-4">
        <div className="rounded-xl p-4 bg-card flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Redeeming</p>
            <p className="text-foreground font-bold text-base mt-1">{rewardName}</p>
          </div>
          <div className="text-primary font-bold text-sm">{rewardCoins} 🪙</div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 mt-5">
        <h2 className="text-foreground font-bold text-base mb-3">Select Payment Method</h2>
        <div className="flex flex-col gap-2">
          {methods.map((method) => {
            const Icon = method.icon;
            const isActive = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  isActive ? "border-primary bg-primary/10" : "border-transparent bg-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <Icon size={20} />
                </div>
                <span className={`font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Details */}
      <div className="px-4 mt-5">
        <h2 className="text-foreground font-bold text-base mb-3">Account Details</h2>
        <input
          type="text"
          value={accountDetail}
          onChange={(e) => setAccountDetail(e.target.value)}
          placeholder={methods.find(m => m.id === selectedMethod)?.placeholder}
          className="w-full bg-card rounded-xl p-4 text-foreground text-sm placeholder:text-muted-foreground outline-none border-2 border-transparent focus:border-primary transition-colors"
        />
        {selectedMethod === "bank" && (
          <input
            type="text"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            placeholder="Enter IFSC Code"
            className="w-full bg-card rounded-xl p-4 text-foreground text-sm placeholder:text-muted-foreground outline-none border-2 border-transparent focus:border-primary transition-colors mt-2"
          />
        )}
      </div>

      {/* Withdraw Button */}
      <div className="px-4 mt-6">
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full py-4 rounded-xl text-primary-foreground font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
          style={{ background: "var(--gold-gradient)" }}
        >
          {loading ? "Processing..." : "Confirm Withdrawal"}
        </button>
        <p className="text-muted-foreground text-xs text-center mt-3">
          Processing time: 24-48 hours
        </p>
      </div>
    </div>
  );
};

export default Withdraw;
