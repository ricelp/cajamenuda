import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

/**
 * Estructura general de la aplicación: Sidebar + Navbar + contenido.
 * El contenido de cada ruta se renderiza con <Outlet />.
 */
export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const ubicacion = useLocation()

  // CICLO DE VIDA: ACTUALIZACIÓN
  // Cuando cambia la ruta se cierra automáticamente el menú lateral móvil.
  useEffect(() => {
    setMenuAbierto(false)
  }, [ubicacion.pathname])

  return (
    <div className="app">
      <Sidebar abierto={menuAbierto} onClose={() => setMenuAbierto(false)} />
      <div className="app-principal">
        <Navbar onMenu={() => setMenuAbierto(true)} />
        <main className="contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}