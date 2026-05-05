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
  const match = trimmed.match(/(?:https?:\/\/|www\.)[^\s]+/i);
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

export const openTaskUrl = (value: string) => {
  const url = normalizeTaskUrl(value);
  if (!url) return;

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer external";
  document.body.appendChild(link);
  link.click();
  link.remove();
};