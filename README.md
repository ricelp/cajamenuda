# Caja Menuda

Sistema web para el control de la **Caja Menuda** de una empresa: registro de gastos con evidencia fotográfica (factura o recibo), consulta de movimientos, reporte diario imprimible y conciliación de caja.

## Descripción

La aplicación permite registrar los gastos realizados con caja menuda, adjuntar una fotografía de cada factura o recibo, calcular el total gastado, consultar los movimientos por día y generar un reporte diario que facilita la conciliación del dinero utilizado.

**Nota importante:** en esta versión académica los datos de Caja Menuda se almacenan localmente utilizando `localStorage`. La API pública se utiliza para demostrar el consumo de servicios REST.

## Tecnologías utilizadas

- **React 19**
- **Vite**
- **JavaScript** (`.jsx`, sin TypeScript)
- **React Hooks** (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`)
- **React Router** (enrutamiento con menú lateral y rutas protegidas por Layout)
- **CSS** moderno (mobile-first, variables, animaciones)
- **Fetch API** para consumir la API pública
- **localStorage** para la persistencia local

## Instalación

```bash
git clone URL_DEL_REPOSITORIO
cd caja-menuda
npm install
npm run dev
```

Reemplaza `URL_DEL_REPOSITORIO` por la URL de tu repositorio de GitHub.

## Ejecución

```bash
npm run dev        # Inicia el servidor de desarrollo en http://localhost:5173
npm run build      # Genera la versión de producción en la carpeta dist/
npm run preview    # Sirve la versión de producción
npm run lint       # Ejecuta el linter (oxlint)
```

## API utilizada

- **Nombre:** DummyJSON
- **Descripción:** API REST pública de demostración que no requiere autenticación.
- **URL:** https://dummyjson.com
- **Endpoints usados:**
  - `GET /products` — se usa en el Dashboard para cargar "gastos de ejemplo" desde la API (demuestra GET, loading, error y retry).
  - `POST /products/add` — se ejecuta al guardar un gasto para demostrar el envío de datos (POST). El resultado se ignora porque la persistencia real es local.
- **Para qué se utiliza:** demostrar el consumo de servicios REST reales (fetch, respuestas, errores, estados de carga). Está aislado en `src/services/api.js`, de modo que en el futuro puede conectarse a un backend real de Caja Menuda cambiando solo esa capa.

## Ciclo de vida de los componentes

El proyecto demuestra el ciclo de vida de React en varios lugares:

- **Montaje:** `src/context/GastosContext.jsx` ejecuta la carga inicial de datos con `useEffect(() => { ... }, [])`. El Dashboard carga los datos iniciales y la sección de API ejecuta la petición al montar.
- **Actualización:** el contexto persiste los gastos en `localStorage` cada vez que cambian (`useEffect(..., [gastos])`). Las listas de gastos se recalculan cuando cambian la fecha, los filtros o el orden (`useMemo`). El menú lateral móvil se cierra cuando cambia la ruta (`Layout`).
- **Desmontaje:** se limpian los recursos al desmontar:
  - `AbortController` cancela la petición a la API si el usuario sale del Dashboard (`src/pages/Dashboard.jsx`).
  - `clearTimeout` limpia los temporizadores pendientes (`GastosContext`).
  - `Modal` elimina el listener de la tecla `Escape` al cerrarse.

## Estados de carga

La aplicación implementa todos los estados de la interfaz:

- **Estado inicial:** pantalla con el layout listo antes de cargar los datos.
- **Cargando:** `Loading` (spinner) y `Skeleton` (skeleton loader) en el listado de gastos y en el Dashboard.
- **Datos cargados:** las tarjetas, tablas y listados muestran la información obtenida.
- **Sin resultados:** `EmptyState` muestra "No existen gastos registrados para esta fecha" con el botón "Registrar primer gasto".
- **Error:** `ErrorState` muestra "No fue posible cargar la información" con el botón **Reintentar**, que vuelve a ejecutar la petición.
- **Recarga:** el botón **Actualizar** en la pantalla de Gastos vuelve a consultar los datos.

## Cómo funciona el registro de facturas

En el formulario de "Registrar gasto" se incluye un input de archivo:

```html
<input type="file" accept="image/*" capture="environment" />
```

- `accept="image/*"` permite seleccionar imágenes.
- `capture="environment"` abre la cámara trasera en teléfonos móviles.
- La imagen se redimensiona y comprime con canvas (`src/utils/imageUtils.js`) para que quepa en `localStorage`.
- Se muestra una **vista previa**, se puede **eliminar** y **cambiar** la fotografía.
- En el listado de gastos la evidencia se abre en un **modal** (`ImagePreview`).

## Cómo funciona la conciliación

En la pantalla "Conciliación de caja":

1. Se selecciona la **fecha** de la conciliación.
2. Se introduce el **saldo inicial** (se puede aplicar y guardar).
3. El sistema calcula automáticamente el **total de gastos** del día.
4. **Saldo esperado = Saldo inicial − Total de gastos**.
5. El usuario introduce el **dinero contado** (dinero físico en caja).
6. **Diferencia = Dinero contado − Saldo esperado**.
7. El resultado muestra si la caja **CUADRA**, tiene **SOBRANTE** o **FALTANTE**.
8. El botón "Guardar conciliación" conserva el resultado en `localStorage`.

## Cómo generar el reporte diario

En la pantalla "Reporte diario":

1. Se selecciona la **fecha**.
2. Se pulsa **Generar reporte**.
3. El reporte muestra el **resumen** (saldo inicial, total de gastos, saldo esperado, dinero contado y diferencia) y el **detalle de gastos** del día.
4. Al final se muestra el **TOTAL DEL DÍA**.
5. El botón **Imprimir reporte** usa `window.print()` con una vista de impresión configurada en el CSS (`@media print`).

## Estructura del proyecto

```
caja-menuda/
│
├── public/                  # favicon
├── screenshots/             # capturas de pantalla
│
├── src/
│   ├── components/          # Navbar, Sidebar, Loading, Skeleton, EmptyState,
│   │                        # ErrorState, ExpenseCard, ExpenseTable, ExpenseForm,
│   │                        # ImagePreview, ConfirmDialog, Modal, Alert, StatCard, Icons
│   ├── context/             # GastosContext (estado global)
│   ├── pages/               # Dashboard, Gastos, RegistrarGasto, Conciliacion,
│   │                        # ReporteDiario, NotFound
│   ├── services/            # api.js (fetch a la API pública + localStorage)
│   ├── hooks/               # useGastos.js
│   ├── utils/               # formatCurrency.js, formatDate.js, imageUtils.js
│   ├── App.jsx              # Rutas
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos (mobile-first)
│
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Capturas de pantalla

![Dashboard](screenshots/dashboard.png)

![Registro de gasto](screenshots/registro-gasto.png)

![Listado de gastos](screenshots/gastos.png)

![Conciliación](screenshots/conciliacion.png)

![Reporte diario](screenshots/reporte.png)

## Conectar con GitHub

El proyecto incluye un `.gitignore` que excluye `node_modules/`, `dist/` y otros archivos innecesarios.

```bash
git init
git add .
git commit -m "Proyecto inicial Caja Menuda"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Reemplaza `URL_DEL_REPOSITORIO` por la URL de tu repositorio de GitHub.

## Autor

**Nombre del estudiante:** Ricel Parra