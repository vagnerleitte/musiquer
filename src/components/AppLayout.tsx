import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-2xl bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Music operations</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Argus Music Registry</h1>
          <h4 className="mt-2 text-base font-medium text-slate-400">Catálogo interno para demonstração</h4>
        </header>
        {children}
      </div>
    </main>
  );
}
