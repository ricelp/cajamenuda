import Modal from './Modal.jsx'
import { Icon } from './Icons.jsx'

/**
 * Diálogo de confirmación antes de eliminar un registro.
 * Uso:
 *   <ConfirmDialog abierto mensaje="¿Eliminar este gasto?"
 *     onConfirmar={...} onCancelar={...} />
 */
export default function ConfirmDialog({
  abierto,
  titulo = 'Confirmar eliminación',
  mensaje = '¿Estás seguro de eliminar este registro?',
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal abierto={abierto} titulo={titulo} onClose={onCancelar} ancho="sm">
      <div className="confirmar-contenido">
        <div className="confirmar-icono">
          <Icon nombre="alerta" size={30} />
        </div>
        <p>{mensaje}</p>
        <div className="confirmar-acciones">
          <button type="button" className="btn btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="btn btn-peligro" onClick={onConfirmar}>
            <Icon nombre="eliminar" size={16} />
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  )
}