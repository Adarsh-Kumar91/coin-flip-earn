export interface TaskOffer {
  id: string;
  name: string;
  description: string;
  coins: number;
  icon: string;
  iconBg: string;
  steps: string[];
  disclaimer: string[];
  url: string;
}

export const taskOffers: TaskOffer[] = [
  {
    id: "foundit",
    name: "Found It",
    description: "Register and verify with OTP",
    coins: 300,
    icon: "foundit",
    iconBg: "#7C3AED",
    steps: [
      "Click on the link.",
      "Download and Open the app.",
      "Register on the app and verify by OTP.",
    ],
    disclaimer: [
      "Any fraud activity will block your Account and all payment will be Cancelled",
      "This app must not be installed in your device earlier",
    ],
    url: "https://www.foundit.in",
  },
  {
    id: "hdfc-ergo",
    name: "HDFC ERGO",
    description: "Install and Register",
    coins: 1000,
    icon: "hdfc",
    iconBg: "#1E3A5F",
    steps: [
      "Click on the link.",
      "Download and Install the app.",
      "Register with your details.",
      "Complete the verification process.",
    ],
    disclaimer: [
      "Any fraud activity will block your Account and all payment will be Cancelled",
      "This app must not be installed in your device earlier",
    ],
    url: "https://www.hdfcergo.com",
  },
    name: "Unstop",
    description: "Register Now",
    coins: 500,
    icon: "unstop",
    iconBg: "#1E3A8A",
    steps: [
      "Click on the link.",
      "Open the website.",
      "Register with your email.",
      "Complete your profile.",
    ],
    disclaimer: [
      "Any fraud activity will block your Account and all payment will be Cancelled",
      "Account must be new",
    ],
    url: "https://unstop.com",
  },
    name: "Groww",
    description: "Install and complete KYC",
    coins: 800,
    icon: "groww",
    iconBg: "#00B386",
    steps: [
      "Click on the link.",
      "Download the app.",
      "Register and complete KYC.",
    ],
    disclaimer: [
      "Any fraud activity will block your Account and all payment will be Cancelled",
      "KYC must be completed fully",
    ],
    url: "https://groww.in",
  },
];

export const categoryCards = [
  { name: "Complete tasks and earn coins", label: "Earn upto", value: "100K+", color: "#F59E0B" },
  { name: "Complete tasks and earn coins", label: "Earn upto", value: "100K+", color: "#14B8A6" },
  { name: "Complete tasks and earn coins", label: "Earn upto", value: "100K+", color: "#F97316" },
];
