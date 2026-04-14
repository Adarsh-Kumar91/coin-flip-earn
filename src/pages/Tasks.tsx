import { useTaskOffers } from "@/hooks/useTaskOffers";
import TaskOfferItem from "@/components/TaskOfferItem";
import BottomNav from "@/components/BottomNav";
import { ClipboardList, CheckCircle } from "lucide-react";

const Tasks = () => {
  const { tasks, loading } = useTaskOffers();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList size={24} className="text-primary" />
          All Tasks
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Complete tasks and earn coins</p>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3 mb-5">
        <div className="bg-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{tasks.length}</p>
          <p className="text-muted-foreground text-xs mt-1">Available Tasks</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center flex flex-col items-center">
          <div className="flex items-center gap-1">
            <CheckCircle size={20} className="text-primary" />
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>
          <p className="text-muted-foreground text-xs mt-1">Completed</p>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-muted-foreground text-center py-4">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Koi task nahi hai abhi</p>
        ) : (
          tasks.map((task) => (
            <TaskOfferItem key={task.id} task={task} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Tasks;
