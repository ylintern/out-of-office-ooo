import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-gothic text-7xl text-glow-necro" style={{ color: "var(--necro-glow)" }}>
          404
        </div>
        <h2 className="mt-4 font-gothic text-2xl">Esta página tirou um Out of Office.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bartholomew não a encontra entre as criptas.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-necro bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-glow-necro"
            style={{ color: "var(--necro-glow)" }}
          >
            Voltar à cripta
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a1410" },
      { title: "$OOO — Out of Office | A app de Bartholomew, o Lich Corporate" },
      {
        name: "description",
        content:
          "Calendário invertido, missões sagradas e a arte de evitar trabalho com classe. Bart ensina-te durante 100 anos.",
      },
      { property: "og:title", content: "$OOO — Out of Office" },
      {
        property: "og:description",
        content: "Descansar é resistência. Bartholomew, o lich corporate, mostra-te como.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/bart-icon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/bart-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
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
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="mx-auto w-full max-w-xl flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
