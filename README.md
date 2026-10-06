# Carrera de caracoles

Aplicación web de apuestas en carreras de caracoles. Permite registrarse, iniciar sesión, cargar saldo con tarjeta a través de la pasarela de pagos simulada **SnailPay** y ver un tablero con las estadísticas del día.

## Qué incluye

- **Registro e inicio de sesión** con validación de formularios y contraseñas cifradas (PBKDF2).
- **Tablero** con el saldo disponible, una gráfica de apuestas ganadas y perdidas, y otra de victorias por caracol en las 6 carreras del día.
- **Carga de saldo** con tarjeta mediante SnailPay, con mensajes claros para cada tipo de rechazo, tiempo de espera agotado o caída del servicio.

## Estructura

El repositorio tiene dos proyectos independientes, cada uno con su propio `package.json`:

| Carpeta   | Qué es                                   | Tecnologías                                                        |
| --------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `client/` | Aplicación web (SPA)                     | React 19, Vite, TypeScript, Tailwind CSS 4, React Router, Recharts, Zod |
| `server/` | API que simula la pasarela SnailPay      | Express 5, TypeScript, Zod                                         |

No hay base de datos. Los usuarios, la sesión, el saldo y las transacciones se guardan en el `localStorage` del navegador; el servidor solo decide si un cobro se aprueba o se rechaza.

## Requisitos

- Node.js 22.12 o superior (también funciona con 20.19+)
- npm

## Cómo correr el proyecto

1. Clona el repositorio:

   ```sh
   git clone https://github.com/daniela-huerta/daniela-1503.git
   cd daniela-1503
   ```

2. Instala y levanta el servidor:

   ```sh
   cd server
   npm install
   npm run dev
   ```

   Queda disponible en `http://localhost:3001`.

3. En **otra terminal**, instala y levanta el cliente:

   ```sh
   cd client
   npm install
   npm run dev
   ```

4. Abre `http://localhost:5173` en el navegador, crea una cuenta y entra al tablero.

No hace falta ningún archivo `.env`: los valores por defecto funcionan en local.

## Tarjetas de prueba

SnailPay responde según el número de tarjeta que se use al cargar saldo:

| Número de tarjeta     | Vencimiento | CVV        | Resultado                                              |
| --------------------- | ----------- | ---------- | ------------------------------------------------------ |
| `1234 1234 1234 1234` | `12/26`     | `543`      | Aprobada; el saldo se acredita                         |
| `1234 1234 1234 1234` | otro        | `543`      | Rechazada: fecha de vencimiento incorrecta             |
| `1234 1234 1234 1234` | `12/26`     | otro       | Rechazada: CVV incorrecto                              |
| `4444 4444 4444 4444` | cualquiera  | cualquiera | Rechazada: fondos insuficientes                        |
| `0101 0101 0101 0101` | cualquiera  | cualquiera | SnailPay tarda en responder y el cliente agota la espera (8 s) |
| Cualquier otro        | cualquiera  | cualquiera | Rechazada: tarjeta declinada                           |

El número se escribe sin espacios (16 dígitos). El nombre del titular puede ser cualquiera y el monto debe ser mayor a $0 y con máximo 2 decimales.

Para probar una caída total de SnailPay, levanta el servidor con:

```sh
npm run dev:outage
```

En ese modo todos los cobros fallan y nunca se acredita saldo.

## Comandos disponibles

En `client/`:

| Comando           | Qué hace                                        |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                          |
| `npm run build`   | Revisa tipos y genera la versión de producción  |
| `npm run preview` | Sirve la versión de producción generada         |
| `npm run lint`    | Revisa el código con oxlint                     |
| `npm test`        | Corre las pruebas                               |

En `server/`:

| Comando              | Qué hace                                      |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo con recarga automática |
| `npm run dev:outage` | Igual, simulando que SnailPay está caído      |
| `npm run build`      | Compila a `dist/`                             |
| `npm start`          | Corre la versión compilada                    |
| `npm test`           | Corre las pruebas                             |

## Variables de entorno (opcionales)

| Variable                   | Dónde   | Valor por defecto       | Para qué sirve                                         |
| -------------------------- | ------- | ----------------------- | ------------------------------------------------------ |
| `PORT`                     | server  | `3001`                  | Puerto de la API                                       |
| `CLIENT_ORIGIN`            | server  | `http://localhost:5173` | Origen permitido por CORS                              |
| `SNAILPAY_SIMULATE_OUTAGE` | server  | `false`                 | Con `true`, todos los cobros responden con error 503   |
| `SNAILPAY_SLOW_DELAY_MS`   | server  | `15000`                 | Demora de la tarjeta de respuesta lenta, en milisegundos |
| `VITE_API_URL`             | client  | `http://localhost:3001` | URL de la API                                          |

## API

| Método | Ruta                    | Descripción                                   |
| ------ | ----------------------- | --------------------------------------------- |
| `GET`  | `/api/health`           | Verifica que el servidor esté arriba          |
| `POST` | `/api/snailpay/charges` | Procesa un cobro con tarjeta                  |

Ejemplo de cobro:

```sh
curl -X POST http://localhost:3001/api/snailpay/charges \
  -H "Content-Type: application/json" \
  -d '{
    "card_number": "1234123412341234",
    "expiration_date": "12/26",
    "cvv": "543",
    "cardholder_name": "Ana Pruebas",
    "amount": 150,
    "payer_id": "user-1",
    "payer_email": "ana@mail.com"
  }'
```

## Notas

- Como los datos viven en `localStorage`, cada navegador tiene sus propias cuentas y saldos. Para empezar de cero, borra los datos del sitio desde las herramientas de desarrollo.
- Las estadísticas del tablero se generan al azar una vez por día.
