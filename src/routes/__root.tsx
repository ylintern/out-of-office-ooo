import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="surface-panel max-w-xl p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary text-primary">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">This corridor is not on the calendar.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Bart looked. The page is either out of office or never accepted the invite.
        </p>
        <Link to="/" className="button-premium mx-auto mt-6 w-fit justify-center">
          Return to the control room
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#141317" },
      { title: "$OOO — Out of Office" },
      {
        name: "description",
        content: "The premium absurdist calendar that celebrates free time, strategic disappearance, and leaving at 17:00 without guilt.",
      },
      { property: "og:title", content: "$OOO — Out of Office" },
      {
        property: "og:description",
        content: "A mobile-first cult calendar for sacred lunch, paid bathroom breaks, ghost meetings, and polished corporate avoidance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "$OOO — Out of Office" },
      {
        name: "twitter:description",
        content: "The calendar app everyone waiting for after one too many meetings that should have been cancelled.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/ooo-icon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/ooo-icon.png" },
      { rel: "canonical", href: "https://out-of-office-ooo.lovable.app" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--color-primary)_22%,transparent),_transparent_32%),linear-gradient(180deg,_transparent,_color-mix(in_oklab,var(--color-background)_82%,black)_100%)]" />
      <TopBar />
      <main className="mx-auto w-full max-w-6xl px-0 pb-28 pt-2 sm:px-4 sm:pb-32">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
