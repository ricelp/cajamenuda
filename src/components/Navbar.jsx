import { Icon } from './Icons.jsx'

/**
 * Barra superior. Solo se muestra en móvil/tablet; en escritorio el
 * menú lateral es fijo. El botón de menú abre el cajón lateral.
 */
export default function Navbar({ onMenu }) {
  return (
    <header className="navbar">
      <button type="button" className="btn-icono" onClick={onMenu} aria-label="Abrir menú">
        <Icon nombre="menu" size={22} />
      </button>
      <div className="navbar-marca">
        <div className="logo-caja">
          <Icon nombre="caja" size={20} />
        </div>
        <strong>Caja Menuda</strong>
      </div>
    </header>
  )
}