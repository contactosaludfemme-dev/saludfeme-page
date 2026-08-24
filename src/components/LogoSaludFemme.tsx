/**
 * Logo "Salud Femme" recreado en SVG imitando el de sus publicaciones:
 * "Salud" en sans-serif y "Femme" en manuscrita, con el símbolo ♀
 * integrado en el trazo.
 *
 * DEMO: reemplazar por el archivo original de su marca cuando esté
 * disponible (SVG o PNG con transparencia).
 */
export default function LogoSaludFemme({
  className = "",
  claro = false,
}: {
  className?: string;
  /** Versión en blanco, para fondos oscuros o de color. */
  claro?: boolean;
}) {
  const salud = claro ? "#FFFFFF" : "#D94A3D";
  const femme = claro ? "#FFFFFF" : "#E5308F";

  return (
    <svg
      viewBox="0 0 200 78"
      className={className}
      role="img"
      aria-label="Salud Femme"
    >
      <text
        x="24"
        y="28"
        fontFamily="var(--font-poppins), sans-serif"
        fontSize="23"
        fontWeight="600"
        fill={salud}
        letterSpacing="0.5"
      >
        Salud
      </text>

      {/* "Femme" en manuscrita */}
      <text
        x="8"
        y="62"
        fontFamily="'Segoe Script', 'Brush Script MT', cursive"
        fontSize="42"
        fontWeight="600"
        fill={femme}
      >
        Fe
      </text>
      <text
        x="96"
        y="62"
        fontFamily="'Segoe Script', 'Brush Script MT', cursive"
        fontSize="42"
        fontWeight="600"
        fill={femme}
      >
        me
      </text>

      {/* Símbolo ♀ que hace de "m" central */}
      <g stroke={femme} strokeWidth="4.5" fill="none" strokeLinecap="round">
        <circle cx="78" cy="42" r="11" />
        <path d="M78 53v18M70 63h16" />
      </g>

      {/* Destellos, como los de sus artes */}
      <g fill={femme} opacity="0.9">
        <path d="M170 18l2.2 5.6L178 26l-5.8 2.4L170 34l-2.2-5.6L162 26l5.8-2.4z" />
        <path d="M186 34l1.4 3.4L191 39l-3.6 1.5L186 44l-1.4-3.5L181 39l3.6-1.6z" />
      </g>
    </svg>
  );
}
