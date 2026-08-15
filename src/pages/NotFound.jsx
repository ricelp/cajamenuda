import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'

export default function NotFound() {
  return (
    <div className="pagina">
      <div className="estado-vacio">
        <div className="estado-vacio-icono">
          <Icon nombre="alerta" size={34} />
        </div>
        <h1>404</h1>
        <h3>Página no encontrada</h3>
        <p>La ruta que buscas no existe.</p>
        <Link to="/" className="btn btn-primario">
          <Icon nombre="dashboard" size={16} /> Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}