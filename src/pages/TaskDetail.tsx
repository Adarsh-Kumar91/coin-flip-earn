import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TaskOffer } from "@/hooks/useTaskOffers";
import { normalizeTaskUrl } from "@/lib/taskUrl";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("task_offers")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setTask(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!task) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Task not found</div>;
  const taskUrl = normalizeTaskUrl(task.url);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <div className="p-4 pt-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center mt-4 mb-2">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-foreground font-bold text-sm" style={{ backgroundColor: task.icon_bg }}>
          {task.icon || task.name.substring(0, 2).toUpperCase()}
        </div>
        <h1 className="text-primary font-bold text-lg mt-3 uppercase tracking-wider">{task.name}</h1>
      </div>

      <div className="px-4 mt-4 flex-1">
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-bold text-base">{task.description}</h2>
            <div className="flex items-center gap-1">
              <span className="text-foreground font-bold text-lg">{task.coins}</span>
              <span className="text-lg">🪙</span>
            </div>
          </div>
          <div className="space-y-1">
            {task.steps.map((step, i) => (
              <p key={i} className="text-muted-foreground text-sm">{i + 1}. {step}</p>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-primary" />
            <h3 className="text-foreground font-bold text-base">Disclaimer</h3>
          </div>
          <div className="space-y-3">
            {task.disclaimer.map((d, i) => (
              <p key={i} className="text-muted-foreground text-sm">{i + 1}. {d}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <a
          href={taskUrl || undefined}
          target="_blank"
          rel="noopener noreferrer external"
          className={`block w-full py-4 rounded-xl font-bold text-lg text-primary-foreground text-center ${!taskUrl ? "pointer-events-none opacity-60" : ""}`}
          style={{ background: "var(--gold-gradient)" }}
        >
          Start Task
        </a>
      </div>
    </div>
  );
};

export default TaskDetail;
