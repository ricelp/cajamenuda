import { NavLink } from 'react-router-dom'
import { Icon } from './Icons.jsx'

// Enlaces del menú de navegación
const ENLACES = [
  { ruta: '/', etiqueta: 'Dashboard', icono: 'dashboard' },
  { ruta: '/gastos', etiqueta: 'Gastos', icono: 'lista' },
  { ruta: '/gastos/nuevo', etiqueta: 'Registrar gasto', icono: 'mas' },
  { ruta: '/conciliacion', etiqueta: 'Conciliación de caja', icono: 'calculadora' },
  { ruta: '/reporte', etiqueta: 'Reporte diario', icono: 'reporte' },
]

/**
 * Menú lateral. En escritorio se muestra fijo a la izquierda;
 * en móvil se convierte en un cajón deslizante.
 */
export default function Sidebar({ abierto, onClose }) {
  return (
    <>
      {/* Fondo oscuro que cubre la pantalla en móvil */}
      <div className={`sidebar-overlay ${abierto ? 'activo' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${abierto ? 'activo' : ''}`}>
        <div className="sidebar-marca">
          <div className="logo-caja">
            <Icon nombre="caja" size={24} />
          </div>
          <div>
            <strong>Caja Menuda</strong>
            <small>Control de gastos</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {ENLACES.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              end={enlace.ruta === '/'}
              className={({ isActive }) => (isActive ? 'activo' : '')}
              onClick={onClose}
            >
              <Icon nombre={enlace.icono} size={18} />
              <span>{enlace.etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-pie">
          <p>Proyecto académico</p>
          <p>Ricel Parra</p>
        </div>
      </aside>
    </>
  )
}