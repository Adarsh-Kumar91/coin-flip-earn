import { Home, ClipboardList, UserPlus, Gift, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ClipboardList, label: "Tasks", path: "/" },
  { icon: UserPlus, label: "Refer", path: "/" },
  { icon: Gift, label: "Rewards", path: "/" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-md mx-auto">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <tab.icon size={20} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
