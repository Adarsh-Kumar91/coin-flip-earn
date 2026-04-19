const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const CHAT_ID = Deno.env.get("ADMIN_TELEGRAM_CHAT_ID");
    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error("Telegram credentials not configured");
    }

    const body = await req.json();
    const {
      userName,
      userEmail,
      userPhone,
      userId,
      reward,
      coins,
      method,
      methodLabel,
      accountDetail,
      ifsc,
      remainingBalance,
    } = body ?? {};

    const text =
      `🪙 <b>New Withdrawal Request</b>\n\n` +
      `👤 <b>User:</b> ${userName ?? "N/A"}\n` +
      `📧 <b>Email:</b> ${userEmail ?? "N/A"}\n` +
      `📱 <b>Phone:</b> ${userPhone ?? "N/A"}\n` +
      `🆔 <b>User ID:</b> <code>${userId ?? "N/A"}</code>\n\n` +
      `🎁 <b>Reward:</b> ${reward}\n` +
      `💰 <b>Coins:</b> ${coins}\n` +
      `💳 <b>Method:</b> ${methodLabel} (${method})\n` +
      `🔢 <b>Account:</b> <code>${accountDetail}</code>\n` +
      (ifsc ? `🏦 <b>IFSC:</b> <code>${ifsc}</code>\n` : "") +
      `\n💼 <b>Remaining Balance:</b> ${remainingBalance} coins\n` +
      `🕒 <b>Time:</b> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await tgRes.json();
    if (!tgRes.ok) {
      console.error("Telegram error:", data);
      throw new Error(`Telegram failed: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("notify-withdrawal error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
