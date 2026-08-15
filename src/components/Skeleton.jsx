// Esqueleto de carga (Skeleton Loader).
// Se muestra mientras llegan los datos para no dejar la pantalla en blanco.
//  - tipo="tabla": simula las filas de la tabla de gastos (escritorio).
//  - tipo="tarjetas": simula las tarjetas de gastos (móvil).
export default function Skeleton({ tipo = 'tabla', cantidad = 4 }) {
  if (tipo === 'tabla') {
    return (
      <div className="skeleton skeleton-tabla" aria-hidden="true">
        <div className="skeleton-linea ancho-30" />
        {Array.from({ length: cantidad }).map((_, i) => (
          <div className="skeleton-fila" key={i}>
            <span className="skeleton-linea ancho-15" />
            <span className="skeleton-linea ancho-55" />
            <span className="skeleton-linea ancho-25" />
            <span className="skeleton-linea ancho-20" />
            <span className="skeleton-linea ancho-15" />
            <span className="skeleton-linea ancho-25" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="skeleton skeleton-tarjetas" aria-hidden="true">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div className="skeleton-tarjeta" key={i}>
          <span className="skeleton-linea ancho-40" />
          <span className="skeleton-linea ancho-80" />
          <span className="skeleton-linea ancho-60" />
        </div>
      ))}
    </div>
  )
}