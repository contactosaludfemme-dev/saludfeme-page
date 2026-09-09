import Image from "next/image";

/**
 * Logo oficial de Salud Femme.
 *
 * Dos versiones: la de color para fondos claros y una en blanco para el
 * footer oscuro y el hero. Ambas recortadas al contenido real y con fondo
 * transparente.
 */
export default function LogoSaludFemme({
  className = "",
  claro = false,
}: {
  className?: string;
  /** Versión en blanco, para fondos oscuros o de color. */
  claro?: boolean;
}) {
  return (
    <Image
      src={claro ? "/logo-salud-femme-blanco.png" : "/logo-salud-femme.png"}
      alt="Salud Femme"
      width={727}
      height={354}
      priority
      className={`w-auto object-contain ${className}`}
    />
  );
}
