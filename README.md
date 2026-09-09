# Sitio web — Matrona Francisca Carrillo

Demo funcional construido con **Next.js 16 + React 19 + Tailwind v4**.

> **Aviso:** este es un demo de presentación. Los testimonios, el número de
> registro profesional, la dirección, los precios y el correo son datos de
> ejemplo y deben reemplazarse por los reales antes de publicar el sitio.
> Ver la lista completa en *Pendientes antes de publicar*.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Qué incluye

| Sección | Estado |
|---|---|
| Home con propuesta de valor y credenciales | ✅ |
| 6 servicios con precio, duración y detalle | ✅ |
| 3 planes de sesiones con ahorro | ✅ |
| Agendamiento en 4 pasos con calendario | ✅ demo |
| Modalidades (presencial / telemedicina) | ✅ |
| Atención particular y medios de pago | ✅ |
| Sobre mí con trayectoria | ✅ |
| Testimonios | ✅ |
| 8 preguntas frecuentes | ✅ |
| Contacto, mapa y horarios | ✅ |
| WhatsApp flotante con mensaje pre-cargado | ✅ |
| Política de privacidad y términos | ✅ borrador |
| SEO local + datos estructurados schema.org | ✅ |

## Dónde editar el contenido

Casi todo el contenido vive en **`src/lib/datos.ts`**: nombre, teléfono,
dirección, horarios, servicios, precios, planes, testimonios y preguntas
frecuentes. Cambiar un precio o agregar un servicio es editar ese archivo.

## Modo demo → producción

Hay tres integraciones simuladas. Cada una tiene un flag `MODO_DEMO` y el
código de producción comentado justo debajo.

### Cómo se administra la agenda

**No hay panel de administración, y es a propósito.** Francisca abre sus horas
creando eventos titulados `DISPONIBLE` en su propio Google Calendar
(`contacto.saludfemme@gmail.com`). El sitio lee ese calendario, parte los
bloques según la duración del servicio y ofrece las horas resultantes. Todo lo
demás en su calendario cuenta como ocupado.

La lógica vive en `src/lib/disponibilidad.ts`. La guía para ella está en
[COMO-ABRIR-HORAS.md](COMO-ABRIR-HORAS.md).

Si más adelante prefiere un panel propio, habría que agregar autenticación,
una base de datos para los bloques y una interfaz de edición — más código y
otra herramienta que mantener, cuando la app de calendario que ya usa hace lo
mismo.

### 1. Google Calendar (`src/lib/google-calendar.ts`)

Hoy la disponibilidad se genera con reglas locales. Para conectar el
calendario real:

```bash
npm install googleapis
```

1. [Google Cloud Console](https://console.cloud.google.com) → crear proyecto
2. Habilitar **Google Calendar API**
3. Crear credenciales **OAuth 2.0** tipo "Aplicación web"
   - URI de redirección: `https://TU-DOMINIO/api/google/callback`
4. Copiar `.env.example` a `.env.local` y completar
5. Autorizar **una sola vez** con la cuenta Google de la matrona para obtener
   el `refresh_token` y guardarlo en `GOOGLE_REFRESH_TOKEN`
6. Cambiar `MODO_DEMO = false`

Al activarlo: la disponibilidad sale de su calendario real vía `freebusy.query`,
el evento se crea automáticamente, la paciente recibe la invitación, y para
consultas online se genera un enlace de Google Meet.

### 2. Correos (`src/lib/correo.ts`)

Hoy se registran en consola. Para enviarlos de verdad:

```bash
npm install resend
```

Crear cuenta en [resend.com](https://resend.com), verificar el dominio,
completar `RESEND_API_KEY` y cambiar `MODO_DEMO = false`.

Se envían dos correos por reserva: confirmación a la paciente (con qué llevar
y enlace de Meet si aplica) y aviso a la matrona (con los datos de contacto de
la paciente y enlace directo a su WhatsApp). El recordatorio de 24 horas lo
envía Google Calendar automáticamente.

### 3. Pago online

Aún no implementado — el flujo actual reserva sin pago. Para agregarlo,
[Flow](https://www.flow.cl) o Webpay vía Transbank son las opciones habituales
en Chile. Las variables ya están en `.env.example`.

## Pendientes antes de publicar

- [ ] Reemplazar las **fotos** (hay dos marcadores de posición)
- [ ] Confirmar el **número de registro** en la Superintendencia de Salud
- [ ] Validar **precios y duraciones** reales de cada servicio
- [ ] Confirmar **dirección, horarios y medios de pago**
- [ ] Reemplazar los **testimonios** por reales, con autorización escrita
- [ ] Revisión legal de **privacidad y términos** (son datos de salud, Ley 21.719)
- [ ] Cambiar el dominio en `src/app/layout.tsx` (`SITIO`) y en `.env.local`
- [ ] Verificar el **mapa** con la ubicación real

## Validaciones y casos límite cubiertos

- **Doble reserva:** el bloque queda tomado al reservar. Con reservas
  simultáneas gana la primera; el resto recibe 409 y vuelve a elegir hora.
  En demo el registro vive en memoria (`src/lib/reservas.ts`); en producción
  Google Calendar es la fuente de verdad y este módulo deja de usarse.
- **Teléfonos:** se acepta cualquier formato chileno real (`988213371`,
  `9 8821 3371`, `+56 9 8821-3371`, con puntos o paréntesis) y se normaliza a
  `+56 9 8821 3371` antes de guardarlo y enviarlo.
- **Correos:** todo dato que escribe la paciente se escapa antes de entrar al
  HTML del correo.
- **Longitudes:** nombre 120, email 160, teléfono 25 y notas 1.000 caracteres,
  limitadas en el formulario y revalidadas en el servidor.
- **Fechas:** se rechazan las pasadas y las fuera de la ventana de 60 días.
  Feriados chilenos de 2026 y 2027 cargados (la ventana cruza el año).
- **Horarios:** colación 13-14h bloqueada, domingos cerrados, anticipación
  mínima de 12 horas, y ningún bloque que se pase de la hora de cierre.
- **Sin conexión:** si la consulta de disponibilidad falla, se muestra el
  horario base con un aviso de que se confirmará por correo.

## Estructura

```
src/
├─ app/
│  ├─ page.tsx              Home
│  ├─ layout.tsx            Fuentes, SEO, schema.org
│  ├─ globals.css           Paleta y tokens de diseño
│  ├─ privacidad/           Política de privacidad
│  ├─ terminos/             Términos y condiciones
│  └─ api/
│     ├─ disponibilidad/    GET horarios libres de un día
│     └─ reservar/          POST crea la cita y dispara correos
├─ components/              Header, Hero, Agendar, Calendario, …
└─ lib/
   ├─ datos.ts              ← todo el contenido editable
   ├─ calendario.ts         Reglas de horario y disponibilidad
   ├─ reservas.ts           Registro de cupos tomados (solo demo)
   ├─ validacion.ts         Normalización de teléfono, email y nombre
   ├─ google-calendar.ts    Integración Google (demo/producción)
   └─ correo.ts             Plantillas HTML de correo
```

## Paleta

Extraída de sus publicaciones en redes sociales:

| Token | Hex | Uso |
|---|---|---|
| `magenta-500` | `#E5308F` | Acento principal, CTA |
| `coral-500` | `#D94A3D` | Acento secundario |
| `rosa-200` | `#F5C6CE` | Fondos destacados |
| `rosa-50` | `#FDF2F4` | Fondo base |
| `carbon` | `#2E2A2B` | Texto |

El blanco sobre rosa claro que usa en Instagram se mantuvo solo en titulares
grandes y sobre bloques de color sólido; el texto de lectura usa gris carbón
para cumplir contraste accesible.
