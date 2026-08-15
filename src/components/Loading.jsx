// Spinner de carga reutilizable.
// Se muestra mientras se obtiene información de la API o de localStorage.
export default function Loading({ texto = 'Cargando información...' }) {
  return (
    <div className="carga" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  )
}