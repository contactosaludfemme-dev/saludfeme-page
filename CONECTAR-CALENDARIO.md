# Conectar Google Calendar

Guía para activar la agenda real. Se hace una sola vez, con la cuenta
`contacto.saludfemme@gmail.com`.

Mientras no se complete, el sitio funciona igual con disponibilidad
simulada: nadie ve errores.

## 1. Crear el proyecto en Google Cloud

1. Entra a [console.cloud.google.com](https://console.cloud.google.com) con
   la cuenta de Salud Femme
2. Crea un proyecto nuevo, por ejemplo *Salud Femme Web*
3. En **APIs y servicios → Biblioteca**, busca **Google Calendar API** y
   habilítala

## 2. Configurar la pantalla de consentimiento

En **APIs y servicios → Pantalla de consentimiento de OAuth**:

- Tipo de usuario: **Externo**
- Nombre de la aplicación: `Salud Femme`
- Correo de asistencia y del desarrollador: `contacto.saludfemme@gmail.com`
- En **Usuarios de prueba**, agrega `contacto.saludfemme@gmail.com`

No hace falta publicar la aplicación ni pasar verificación: la usa una sola
cuenta, la de ella.

## 3. Crear las credenciales

En **APIs y servicios → Credenciales → Crear credenciales → ID de cliente
de OAuth**:

- Tipo: **Aplicación web**
- Nombre: `Sitio Salud Femme`
- En **URI de redirección autorizados**, agrega exactamente:

```
https://saludfeme-page.vercel.app/api/google/callback
```

Google entrega un **ID de cliente** y un **secreto de cliente**. Guárdalos.

> Si el sitio queda en un dominio propio, hay que agregar también esa URI.

## 4. Cargar las variables en Vercel

En el proyecto de Vercel, **Settings → Environment Variables**:

| Variable | Valor |
|---|---|
| `GOOGLE_CLIENT_ID` | el ID de cliente del paso 3 |
| `GOOGLE_CLIENT_SECRET` | el secreto del paso 3 |
| `GOOGLE_REDIRECT_URI` | `https://saludfeme-page.vercel.app/api/google/callback` |
| `GOOGLE_CALENDAR_ID` | `primary` |

Vuelve a desplegar para que tomen efecto.

## 5. Autorizar

Con la sesión de `contacto.saludfemme@gmail.com` abierta en el navegador,
entra a:

```
https://saludfeme-page.vercel.app/api/google/auth
```

Google pedirá permiso para ver y crear eventos. Al aceptar, la página
muestra un **refresh token**.

> Aparecerá un aviso de "aplicación no verificada". Es esperable en
> aplicaciones de uso interno: entra en *Configuración avanzada → Ir a
> Salud Femme*.

## 6. Guardar el token

Copia el valor que aparece y créalo en Vercel como:

| Variable | Valor |
|---|---|
| `GOOGLE_REFRESH_TOKEN` | el token que entregó la página |

Vuelve a desplegar. Listo.

**Cópialo apenas aparezca:** la página no lo almacena. Si la cierras sin
guardarlo, hay que repetir el paso 5.

## 7. Comprobar

Entra a:

```
https://saludfeme-page.vercel.app/api/google/estado
```

Debe responder que el calendario está conectado. Desde ahí:

- La disponibilidad sale de los bloques **DISPONIBLE** de su calendario
- Cada reserva crea un evento con los datos de la paciente
- Las consultas online generan enlace de Google Meet
- Google envía la invitación y el recordatorio de 24 horas

Cómo abrir horas está en [COMO-ABRIR-HORAS.md](COMO-ABRIR-HORAS.md).

## Correos (opcional)

El calendario ya envía la invitación a la paciente. Si además quieres los
correos con el diseño de Salud Femme:

1. Crear cuenta en [resend.com](https://resend.com) y verificar el dominio
2. Cargar en Vercel:

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | la clave de Resend |
| `EMAIL_DESDE` | `Salud Femme <hola@tudominio.cl>` |

Sin esto las reservas funcionan igual; solo no salen esos correos.

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| `redirect_uri_mismatch` | La URI en Google Cloud no coincide con `GOOGLE_REDIRECT_URI`, carácter por carácter |
| No entrega refresh token | La cuenta ya había autorizado. Revoca en [myaccount.google.com/permissions](https://myaccount.google.com/permissions) y repite |
| `/api/google/auth` da 503 | Faltan las variables del paso 4, o no se redesplegó |
| Sitio sin horas disponibles | No hay eventos "DISPONIBLE" en el calendario para esos días |
