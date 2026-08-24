import Link from "next/link";
import Footer from "./Footer";

export default function PaginaLegal({
  titulo, actualizado, children,
}: {
  titulo: string;
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-gris-claro bg-rosa-50">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span aria-hidden className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-magenta-500 to-coral-500 font-titulo text-sm font-bold text-white">
              FC
            </span>
            <span className="font-titulo font-bold text-carbon">Francisca Carrillo</span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center text-[0.9rem] font-semibold text-magenta-600 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="text-[clamp(1.8rem,4vw,2.4rem)]">{titulo}</h1>
        <p className="mt-2 text-[0.85rem] text-gris">Última actualización: {actualizado}</p>
        <div className="legal mt-8 space-y-6">{children}</div>
      </main>

      <Footer />
    </>
  );
}
