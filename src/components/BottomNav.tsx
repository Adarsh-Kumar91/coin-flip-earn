import { Home, ClipboardList, UserPlus, Gift, User } from "lucide-react";

const tabs = [
  { icon: Home, label: "Home" },
  { icon: ClipboardList, label: "Tasks" },
  { icon: UserPlus, label: "Refer" },
  { icon: Gift, label: "Rewards" },
  { icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-md mx-auto">
      <div className="flex justify-around py-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${i === 0 ? "text-primary" : "text-muted-foreground"}`}
          >
            <tab.icon size={20} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
