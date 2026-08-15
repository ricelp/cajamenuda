import Modal from './Modal.jsx'

/**
 * Modal que muestra la fotografía de la factura/recibo a tamaño completo.
 * Uso: <ImagePreview imagen={dataUrl} descripcion={...} onClose={...} />
 */
export default function ImagePreview({ imagen, descripcion, onClose }) {
  return (
    <Modal abierto={Boolean(imagen)} titulo="Factura / Recibo" onClose={onClose} ancho="lg">
      <div className="imagen-preview">
        {imagen ? (
          <img src={imagen} alt={descripcion || 'Factura o recibo del gasto'} />
        ) : (
          <p>Este gasto no tiene fotografía adjunta.</p>
        )}
        {descripcion && <p className="imagen-preview-caption">{descripcion}</p>}
      </div>
    </Modal>
  )
}