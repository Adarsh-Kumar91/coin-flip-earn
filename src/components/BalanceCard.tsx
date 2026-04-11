const BalanceCard = ({ balance }: { balance: number }) => {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{ background: "var(--gold-gradient)" }}
    >
      <div className="relative z-10">
        <p className="text-primary-foreground/80 text-sm font-medium">My Balance</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary-foreground">{balance}</span>
            <span className="text-2xl">🪙</span>
          </div>
          <button className="bg-primary-foreground/90 text-primary-foreground px-5 py-2 rounded-full font-semibold text-sm" style={{ color: "hsl(var(--gold-dark))" }}>
            Redeem &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
