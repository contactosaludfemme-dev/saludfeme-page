/**
 * Arte del artículo en formato 4:5, igual que sus carruseles de Instagram.
 * Si todavía no hay imagen, muestra un marcador con el ícono del tema.
 */
export default function ArtePost({
  imagen, icono, titulo, className = "",
}: {
  imagen?: string;
  icono: string;
  titulo: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[4/5] shrink-0 self-start overflow-hidden rounded-2xl bg-gradient-to-br from-rosa-200 via-rosa-100 to-rosa-50 ${className}`}
    >
      {imagen ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagen}
          alt={titulo}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="grid size-full place-content-center place-items-center gap-2 p-4 text-center">
          <span aria-hidden className="text-4xl">
            {icono}
          </span>
          <span className="font-titulo text-[0.72rem] font-semibold uppercase tracking-wider text-magenta-600/70">
            Arte del post
          </span>
        </div>
      )}
    </div>
  );
}
