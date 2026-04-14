import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

interface TaskOffer {
  id: string;
  name: string;
  description: string;
  coins: number;
  icon: string;
  icon_bg: string;
  steps: string[];
  disclaimer: string[];
  url: string;
  is_active: boolean;
  created_by: string;
}

const emptyTask = {
  name: "",
  description: "",
  coins: 100,
  icon: "",
  icon_bg: "#7C3AED",
  steps: [""],
  disclaimer: [""],
  url: "",
  is_active: true,
};

const AdminTasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTask);

  const fetchTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("task_offers")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!form.name || !form.url) {
      toast({ title: "Name aur URL dena zaroori hai", variant: "destructive" });
      return;
    }

    const payload = {
      ...form,
      steps: form.steps.filter(s => s.trim()),
      disclaimer: form.disclaimer.filter(d => d.trim()),
      created_by: user.id,
    };

    if (editing) {
      const { error } = await supabase.from("task_offers").update(payload).eq("id", editing);
      if (error) { toast({ title: "Update failed", variant: "destructive" }); return; }
      toast({ title: "Task updated! ✅" });
    } else {
      const { error } = await supabase.from("task_offers").insert(payload);
      if (error) { toast({ title: "Add failed", variant: "destructive" }); return; }
      toast({ title: "Task added! ✅" });
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyTask);
    fetchTasks();
  };

  const handleEdit = (task: TaskOffer) => {
    setForm({
      name: task.name,
      description: task.description,
      coins: task.coins,
      icon: task.icon,
      icon_bg: task.icon_bg,
      steps: task.steps.length ? task.steps : [""],
      disclaimer: task.disclaimer.length ? task.disclaimer : [""],
      url: task.url,
      is_active: task.is_active,
    });
    setEditing(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("task_offers").delete().eq("id", id);
    if (!error) {
      toast({ title: "Task deleted! 🗑️" });
      fetchTasks();
    }
  };

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, ""] }));
  const addDisclaimer = () => setForm(f => ({ ...f, disclaimer: [...f.disclaimer, ""] }));
  const updateStep = (i: number, v: string) => setForm(f => ({ ...f, steps: f.steps.map((s, idx) => idx === i ? v : s) }));
  const updateDisclaimer = (i: number, v: string) => setForm(f => ({ ...f, disclaimer: f.disclaimer.map((d, idx) => idx === i ? v : d) }));
  const removeStep = (i: number) => setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
  const removeDisclaimer = (i: number) => setForm(f => ({ ...f, disclaimer: f.disclaimer.filter((_, idx) => idx !== i) }));

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
      <div className="p-4 pt-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)}><ArrowLeft size={22} className="text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">Manage Tasks</h1>
      </div>

      {!showForm && (
        <div className="px-4 mb-4">
          <Button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyTask); }} className="w-full gap-2">
            <Plus size={18} /> Naya Task Add Karo
          </Button>
        </div>
      )}

      {showForm && (
        <div className="px-4 mb-4">
          <div className="bg-card rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-foreground">{editing ? "Edit Task" : "Naya Task"}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(emptyTask); }}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <Input placeholder="App ka naam" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Short description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <Input placeholder="App URL / Link" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            <div className="flex gap-2">
              <Input type="number" placeholder="Coins (100-200)" value={form.coins} onChange={e => setForm(f => ({ ...f, coins: Number(e.target.value) }))} className="flex-1" />
              <Input placeholder="Icon text (2-3 letters)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="flex-1" />
            </div>
            <div className="flex gap-2 items-center">
              <Input placeholder="Icon BG color (#hex)" value={form.icon_bg} onChange={e => setForm(f => ({ ...f, icon_bg: e.target.value }))} className="flex-1" />
              <div className="w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: form.icon_bg }} />
            </div>

            {/* Steps */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Steps:</p>
              {form.steps.map((s, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <Input placeholder={`Step ${i + 1}`} value={s} onChange={e => updateStep(i, e.target.value)} className="flex-1" />
                  {form.steps.length > 1 && <button onClick={() => removeStep(i)}><X size={16} className="text-muted-foreground" /></button>}
                </div>
              ))}
              <button onClick={addStep} className="text-primary text-xs font-semibold">+ Add Step</button>
            </div>

            {/* Disclaimer */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Disclaimer:</p>
              {form.disclaimer.map((d, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <Input placeholder={`Disclaimer ${i + 1}`} value={d} onChange={e => updateDisclaimer(i, e.target.value)} className="flex-1" />
                  {form.disclaimer.length > 1 && <button onClick={() => removeDisclaimer(i)}><X size={16} className="text-muted-foreground" /></button>}
                </div>
              ))}
              <button onClick={addDisclaimer} className="text-primary text-xs font-semibold">+ Add Disclaimer</button>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              <span className="text-sm text-foreground">Active (users ko dikhega)</span>
            </div>

            <Button onClick={handleSave} className="w-full gap-2"><Save size={16} /> {editing ? "Update" : "Save"}</Button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Koi task nahi hai. Upar se add karo!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ backgroundColor: task.icon_bg }}>
                {task.icon || task.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm">{task.name}</h3>
                <p className="text-muted-foreground text-xs truncate">{task.description}</p>
                <p className="text-primary text-xs font-bold mt-0.5">🪙 {task.coins} coins {!task.is_active && <span className="text-destructive">(Inactive)</span>}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(task)} className="p-2 rounded-lg bg-secondary"><Pencil size={16} className="text-foreground" /></button>
                <button onClick={() => handleDelete(task.id)} className="p-2 rounded-lg bg-secondary"><Trash2 size={16} className="text-destructive" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default AdminTasks;
