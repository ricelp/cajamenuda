import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGastos } from '../hooks/useGastos.js'
import ExpenseForm from '../components/ExpenseForm.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Alert from '../components/Alert.jsx'
import { Icon } from '../components/Icons.jsx'

/**
 * Pantalla de registro / edición de un gasto.
 * - Ruta "/gastos/nuevo": crea un gasto nuevo.
 * - Ruta "/gastos/editar/:id": edita un gasto existente.
 */
export default function RegistrarGasto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gastos, agregarGasto, actualizarGasto } = useGastos()

  const esEdicion = Boolean(id)
  const gastoActual = esEdicion ? gastos.find((gasto) => gasto.id === id) : null
  const [mensaje, setMensaje] = useState('')

  async function manejarGuardar(datos) {
    if (esEdicion) {
      actualizarGasto(id, datos)
      setMensaje('El gasto se actualizó correctamente.')
    } else {
      agregarGasto(datos)
      setMensaje('El gasto se registró correctamente.')
    }

    // Se muestra el mensaje de éxito y luego se vuelve a la lista
    setTimeout(() => navigate('/gastos'), 900)
  }

  // Si se intenta editar un gasto que no existe
  if (esEdicion && !gastoActual) {
    return (
      <div className="pagina">
        <EmptyState
          titulo="Gasto no encontrado"
          mensaje="El gasto que intentas editar no existe o fue eliminado."
          botonTexto="Volver a Gastos"
          onBoton={() => navigate('/gastos')}
        />
      </div>
    )
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>{esEdicion ? 'Editar gasto' : 'Registrar gasto'}</h1>
          <p>
            {esEdicion
              ? 'Modifica la información del gasto.'
              : 'Completa los datos del gasto realizado con caja menuda.'}
          </p>
        </div>
        <Link to="/gastos" className="btn btn-secundario">
          <Icon nombre="chevron-izq" size={16} /> Volver
        </Link>
      </header>

      {mensaje && <Alert tipo="exito" mensaje={mensaje} />}

      <div className="tarjeta">
        <ExpenseForm
          gastoInicial={gastoActual}
          onSubmit={manejarGuardar}
          onCancelar={() => navigate('/gastos')}
        />
      </div>
    </div>
  )
}