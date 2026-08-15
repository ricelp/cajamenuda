import { Icon } from './Icons.jsx'

/**
 * Tarjeta informativa del Dashboard.
 * Uso: <StatCard icono="billete" etiqueta="Saldo inicial" valor="B/. 500.00" tono="primario" />
 */
export default function StatCard({ icono, etiqueta, valor, sub, tono = 'primario' }) {
  return (
    <article className={`tarjeta tarjeta-stat stat-${tono}`}>
      <div className="stat-icono">
        <Icon nombre={icono} size={22} />
      </div>
      <div className="stat-texto">
        <span className="stat-etiqueta">{etiqueta}</span>
        <strong className="stat-valor">{valor}</strong>
        {sub && <small className="stat-sub">{sub}</small>}
      </div>
    </article>
  )
}