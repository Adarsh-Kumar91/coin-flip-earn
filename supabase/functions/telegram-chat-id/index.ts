const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      throw new Error("Telegram bot token is not configured");
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 20, allowed_updates: ["message"] }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return new Response(JSON.stringify({ success: false, error: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 502,
      });
    }

    const chats = new Map<string, unknown>();
    for (const update of data.result ?? []) {
      const message = update.message ?? update.edited_message ?? update.channel_post;
      const chat = message?.chat;
      if (!chat?.id) continue;

      chats.set(String(chat.id), {
        chatId: String(chat.id),
        type: chat.type,
        firstName: chat.first_name ?? null,
        lastName: chat.last_name ?? null,
        username: chat.username ?? null,
        lastMessage: message.text ?? null,
        date: message.date ? new Date(message.date * 1000).toISOString() : null,
      });
    }

    return new Response(JSON.stringify({ success: true, chats: [...chats.values()] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});