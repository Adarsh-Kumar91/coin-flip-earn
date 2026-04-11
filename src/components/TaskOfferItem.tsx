import { TaskOffer } from "@/data/tasks";
import { useNavigate } from "react-router-dom";

const iconText: Record<string, string> = {
  foundit: "foundit",
  hdfc: "here.",
  unstop: "Un",
  groww: "G",
};

const TaskOfferItem = ({ task }: { task: TaskOffer }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-card rounded-xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => navigate(`/task/${task.id}`)}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-foreground font-bold text-xs shrink-0"
        style={{ backgroundColor: task.iconBg, border: `2px solid ${task.iconBg}` }}
      >
        {iconText[task.icon] || task.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-base">{task.name}</h3>
        <p className="text-muted-foreground text-sm">{task.description}</p>
      </div>
      <div className="bg-secondary rounded-lg px-3 py-2 text-center shrink-0">
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Earn upto</p>
        <p className="font-bold text-primary text-lg">🪙{task.coins}</p>
      </div>
    </div>
  );
};

export default TaskOfferItem;
