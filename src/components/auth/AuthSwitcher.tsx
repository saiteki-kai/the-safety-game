import { useEffect, useState } from "react";

import RegisterForm from "./RegisterForm";
import SignInForm from "./SignInForm";

type Mode = "register" | "signin";

const hashForMode: Record<Mode, string> = {
  register: "#register",
  signin: "#signin",
};

const panelId: Record<Mode, string> = {
  register: "register",
  signin: "signin",
};

const tabId: Record<Mode, string> = {
  register: "auth-tab-register",
  signin: "auth-tab-signin",
};

function normalizeModeFromHash(hash: string | null | undefined): Mode | null {
  if (!hash) return null;
  const lower = hash.toLowerCase();
  if (lower.includes("signin")) return "signin";
  if (lower.includes("register")) return "register";
  return null;
}

export default function AuthSwitcher() {
  const [mode, setMode] = useState<Mode>("register");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyHashMode = () => {
      const next = normalizeModeFromHash(window.location.hash);
      if (next) {
        setMode(next);
      }
    };

    applyHashMode();

    window.addEventListener("hashchange", applyHashMode);
    return () => window.removeEventListener("hashchange", applyHashMode);
  }, []);

  const handleSwitch = (next: Mode) => {
    setMode(next);

    if (typeof window !== "undefined") {
      const hash = hashForMode[next];
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  };

  const isRegister = mode === "register";

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex items-center justify-end gap-3 font-semibold text-base text-neutral-400"
        role="tablist"
        aria-label="Seleziona modalità"
      >
        <button
          type="button"
          role="tab"
          id={tabId.signin}
          aria-selected={!isRegister}
          aria-controls={panelId.signin}
          className={`transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            !isRegister ? "text-neutral-900" : "hover:text-neutral-700"
          }`}
          onClick={() => handleSwitch("signin")}
        >
          Accedi
        </button>
        <span className="text-neutral-300" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          role="tab"
          id={tabId.register}
          aria-selected={isRegister}
          aria-controls={panelId.register}
          className={`transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            isRegister ? "text-neutral-900" : "hover:text-neutral-700"
          }`}
          onClick={() => handleSwitch("register")}
        >
          Crea il team
        </button>
      </div>

      <div className="space-y-0">
        <div
          id={panelId.register}
          role="tabpanel"
          aria-labelledby={tabId.register}
          className={isRegister ? "block" : "hidden"}
        >
          <RegisterForm onSwitch={() => handleSwitch("signin")} />
        </div>
        <div
          id={panelId.signin}
          role="tabpanel"
          aria-labelledby={tabId.signin}
          className={isRegister ? "hidden" : "block"}
        >
          <SignInForm onSwitch={() => handleSwitch("register")} />
        </div>
      </div>
    </div>
  );
}
