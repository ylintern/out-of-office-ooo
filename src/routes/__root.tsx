import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="app-frame flex min-h-screen items-center justify-center px-4">
      <div className="data-card max-w-xl p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary text-primary">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">This corridor never made it into the doctrine.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Bart searched calmly. The page is either out of office or refused the invite on principle.
        </p>
        <Link to="/" className="button-premium mx-auto mt-6 w-fit justify-center">
          Return to Today
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
      { name: "theme-color", content: "#17161c" },
      { title: "$OOO — Out of Office" },
      {
        name: "description",
        content: "A pocket absurdist calendar for protected lunch, strategic absence, and leaving on time with spiritual clarity.",
      },
      { property: "og:title", content: "$OOO — Out of Office" },
      {
        property: "og:description",
        content: "The darkly funny PWA calendar for defended breaks, ghost meetings, Bart doctrine, and elegant disengagement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "$OOO — Out of Office" },
      {
        name: "twitter:description",
        content: "Protected lunch, sarcastic reminders, and better ways to survive the calendar without becoming it.",
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
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="app-frame text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,var(--color-primary)_20%,transparent),_transparent_30%),linear-gradient(180deg,_transparent,_color-mix(in_oklab,var(--color-background)_84%,black)_100%)]" />
      <div className="app-canvas pb-6">
        <div className="app-screen overflow-hidden">
          <TopBar />
          <main className="px-3 pb-28 pt-3 sm:px-4 sm:pb-32">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
