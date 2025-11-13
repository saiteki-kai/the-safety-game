import { navigate } from "astro:transitions/client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import type { Profile } from "@lib/supabase.types";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DashboardNavProps = {
  user: Profile;
  className?: string;
};

const handleSignOut = async () => {
  const result = await fetch("/api/auth/signout");

  if (!result.ok) {
    toast.error("Si è verificato un errore. Riprova.", {
      duration: 2000,
      position: "bottom-center",
      id: "logout-error",
    });

    console.error("Error signing out:", result.statusText);
    return;
  }

  navigate("/login");
};

export default function DashboardNav({ user }: DashboardNavProps) {
  const displayName = user.full_name;
  const displayEmail = user.email;

  return (
    <nav
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-4 bg-black px-6 py-4 text-white",
        "px-4 py-3 sm:px-7",
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.avatar_url} alt={displayName} />
          <AvatarFallback className="bg-linear-to-br from-neutral-100 to-neutral-200 font-semibold text-lg text-neutral-600">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-white">{displayName}</span>
          <span className="text-neutral-300 text-xs">{displayEmail}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/");
          }}
          aria-label="Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M3 11.25L12 4l9 7.25V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.75z" />
          </svg>
          <span>Home</span>
        </Button>

        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
}
