import { Zap, Flame } from "lucide-react";
import BalanceCard from "@/components/BalanceCard";
import CategoryCards from "@/components/CategoryCards";
import TaskOfferItem from "@/components/TaskOfferItem";
import BottomNav from "@/components/BottomNav";
import { taskOffers } from "@/data/tasks";

const Index = () => {
  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6">
        <div>
          <span className="text-muted-foreground text-sm">Hi, </span>
          <span className="text-foreground text-xl font-bold">sanjeev</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1.5">
            <Zap size={16} className="text-primary" />
            <span className="text-foreground font-semibold text-sm">5</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1.5">
            <Flame size={16} className="text-primary" />
            <span className="text-foreground text-xs font-semibold">Play & Earn</span>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="px-4">
        <BalanceCard balance={499} />
      </div>

      {/* Category Cards */}
      <div className="px-4 mt-5">
        <CategoryCards />
      </div>

      {/* Task Offers */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">TaskOffers</h2>
          <button className="text-muted-foreground text-sm">view all</button>
        </div>
        <div className="flex flex-col gap-3">
          {taskOffers.map((task) => (
            <TaskOfferItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
