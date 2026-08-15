import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Gastos from './pages/Gastos.jsx'
import RegistrarGasto from './pages/RegistrarGasto.jsx'
import Conciliacion from './pages/Conciliacion.jsx'
import ReporteDiario from './pages/ReporteDiario.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * Configuración de rutas de la aplicación.
 * Todas las rutas comparten el Layout (Sidebar + Navbar).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="gastos/nuevo" element={<RegistrarGasto />} />
        <Route path="gastos/editar/:id" element={<RegistrarGasto />} />
        <Route path="conciliacion" element={<Conciliacion />} />
        <Route path="reporte" element={<ReporteDiario />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}