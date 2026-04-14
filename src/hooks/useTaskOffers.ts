import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TaskOffer {
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

export const useTaskOffers = () => {
  const [tasks, setTasks] = useState<TaskOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("task_offers")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setTasks(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return { tasks, loading };
};
