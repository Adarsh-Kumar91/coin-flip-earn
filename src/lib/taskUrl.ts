const PLAY_STORE_DETAILS_URL = "https://play.google.com/store/apps/details";

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const extractFirstUrl = (value: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/(?:https?:\/\/|intent:\/\/|market:\/\/|www\.)[^\s]+/i);
  return (match?.[0] || trimmed).replace(/[),.]+$/g, "");
};

const getPackageId = (value: string) => {
  const decoded = safeDecode(value);
  const idMatch = decoded.match(/[?&#]id=([^&#;]+)/);
  const packageMatch = decoded.match(/;package=([^;#]+)/);
  return idMatch?.[1] || packageMatch?.[1] || "";
};

export const normalizeTaskUrl = (value: string) => {
  const rawUrl = extractFirstUrl(value);
  if (!rawUrl) return "";

  const packageId = getPackageId(rawUrl);
  if (packageId && (rawUrl.startsWith("intent://") || rawUrl.startsWith("market://") || rawUrl.includes("play.google.com/store/apps/details"))) {
    return `${PLAY_STORE_DETAILS_URL}?id=${encodeURIComponent(packageId)}`;
  }

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  if (rawUrl.startsWith("www.")) {
    return `https://${rawUrl}`;
  }

  if (!rawUrl.includes(".") || rawUrl.includes(" ")) {
    return "";
  }

  return `https://${rawUrl}`;
};

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
};

export const isPlayStoreUrl = (value: string) => {
  const url = normalizeTaskUrl(value);
  return Boolean(url && getPackageId(url) && url.includes("play.google.com/store/apps/details"));
};

export const openTaskUrl = async (value: string, title = "Task") => {
  const url = normalizeTaskUrl(value);
  if (!url) return { ok: false as const, action: "invalid" as const, url: "" };

  if (isPlayStoreUrl(url)) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return { ok: true as const, action: "shared" as const, url };
      } catch {
        await copyToClipboard(url);
        return { ok: true as const, action: "copied" as const, url };
      }
    }

    await copyToClipboard(url);
    return { ok: true as const, action: "copied" as const, url };
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer external";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return { ok: true as const, action: "opened" as const, url };
};