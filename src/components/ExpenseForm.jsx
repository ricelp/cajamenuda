import { useRef, useState } from 'react'
import { CATEGORIAS } from '../services/api.js'
import { hoyISO } from '../utils/formatDate.js'
import { parseMonto } from '../utils/formatCurrency.js'
import { prepararImagen } from '../utils/imageUtils.js'
import Alert from './Alert.jsx'
import { Icon } from './Icons.jsx'

// Valores por defecto del formulario
const FORM_VACIO = {
  fecha: '',
  descripcion: '',
  categoria: '',
  monto: '',
  factura: '',
  proveedor: '',
  observaciones: '',
  imagen: null,
}

/**
 * Formulario de registro/edición de un gasto.
 * Incluye validaciones y la carga de la fotografía de la factura.
 */
export default function ExpenseForm({ gastoInicial = null, onSubmit, onCancelar }) {
  // Estado inicial: si viene un gasto se precargan sus datos (modo edición)
  const [form, setForm] = useState(() =>
    gastoInicial
      ? { ...FORM_VACIO, ...gastoInicial, monto: String(gastoInicial.monto) }
      : { ...FORM_VACIO, fecha: hoyISO() },
  )
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [imagenCargando, setImagenCargando] = useState(false)
  const archivoRef = useRef(null)

  const setCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  // ---------- VALIDACIONES ----------
  function validar() {
    const nuevosErrores = {}
    if (!form.fecha) nuevosErrores.fecha = 'La fecha es obligatoria.'
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria.'
    if (!form.categoria) nuevosErrores.categoria = 'Selecciona una categoría.'

    const monto = parseMonto(form.monto)
    if (!form.monto || Number.isNaN(monto)) {
      nuevosErrores.monto = 'El monto es obligatorio.'
    } else if (monto <= 0) {
      nuevosErrores.monto = 'El monto debe ser mayor que B/. 0.00'
    }
    return nuevosErrores
  }

  // ---------- FOTOGRAFÍA ----------
  async function manejarArchivo(evento) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return

    setImagenCargando(true)
    try {
      // Se redimensiona y comprime la imagen para que quepa en localStorage
      const dataUrl = await prepararImagen(archivo)
      setCampo('imagen', dataUrl)
      setErrorGeneral('')
    } catch {
      setErrorGeneral('No se pudo procesar la fotografía. Intenta con otra imagen.')
    } finally {
      setImagenCargando(false)
      // Permite volver a seleccionar el mismo archivo
      evento.target.value = ''
    }
  }

  function quitarImagen() {
    setCampo('imagen', null)
  }

  // ---------- ENVÍO ----------
  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')

    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    try {
      await onSubmit({
        ...form,
        monto: parseMonto(form.monto),
        descripcion: form.descripcion.trim(),
        factura: form.factura.trim(),
        proveedor: form.proveedor.trim(),
        observaciones: form.observaciones.trim(),
      })
    } catch {
      setErrorGeneral('No se pudo guardar el gasto. Inténtalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      {errorGeneral && (
        <Alert tipo="error" mensaje={errorGeneral} onClose={() => setErrorGeneral('')} />
      )}

      <div className="form-grid">
        <div className="campo">
          <label htmlFor="fecha">
            Fecha <span className="requerido">*</span>
          </label>
          <input
            id="fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => setCampo('fecha', e.target.value)}
          />
          {errores.fecha && <span className="error-campo">{errores.fecha}</span>}
        </div>

        <div className="campo">
          <label htmlFor="monto">
            Monto (B/.) <span className="requerido">*</span>
          </label>
          <input
            id="monto"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="0.00"
            value={form.monto}
            onChange={(e) => setCampo('monto', e.target.value)}
          />
          {errores.monto && <span className="error-campo">{errores.monto}</span>}
        </div>

        <div className="campo campo-ancho">
          <label htmlFor="descripcion">
            Descripción <span className="requerido">*</span>
          </label>
          <input
            id="descripcion"
            type="text"
            placeholder="Ej. Compra de materiales de oficina"
            value={form.descripcion}
            onChange={(e) => setCampo('descripcion', e.target.value)}
          />
          {errores.descripcion && <span className="error-campo">{errores.descripcion}</span>}
        </div>

        <div className="campo">
          <label htmlFor="categoria">
            Categoría <span className="requerido">*</span>
          </label>
          <select
            id="categoria"
            value={form.categoria}
            onChange={(e) => setCampo('categoria', e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          {errores.categoria && <span className="error-campo">{errores.categoria}</span>}
        </div>

        <div className="campo">
          <label htmlFor="factura">Número de factura</label>
          <input
            id="factura"
            type="text"
            placeholder="Ej. FAC-00125"
            value={form.factura}
            onChange={(e) => setCampo('factura', e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="proveedor">Proveedor</label>
          <input
            id="proveedor"
            type="text"
            placeholder="Ej. Librería XYZ"
            value={form.proveedor}
            onChange={(e) => setCampo('proveedor', e.target.value)}
          />
        </div>

        <div className="campo campo-ancho">
          <label>Fotografía de factura / recibo</label>

          {/* Input oculto: capture="environment" abre la cámara en móviles */}
          <input
            ref={archivoRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={manejarArchivo}
          />

          {form.imagen ? (
            <div className="foto-preview">
              <img src={form.imagen} alt="Vista previa de la factura" />
              <div className="foto-preview-acciones">
                <button
                  type="button"
                  className="btn btn-secundario"
                  onClick={() => archivoRef.current?.click()}
                >
                  <Icon nombre="refrescar" size={15} /> Cambiar
                </button>
                <button type="button" className="btn btn-peligro" onClick={quitarImagen}>
                  <Icon nombre="eliminar" size={15} /> Quitar
                </button>
              </div>
            </div>
          ) : (
            <div className="foto-zona">
              <Icon nombre="camara" size={28} />
              <p>Adjunta una fotografía de la factura o recibo.</p>
              <small>
                {imagenCargando ? 'Procesando imagen...' : 'Toma una foto o selecciona un archivo.'}
              </small>
              <button
                type="button"
                className="btn btn-secundario"
                onClick={() => archivoRef.current?.click()}
              >
                <Icon nombre="camara" size={16} /> Tomar foto / Seleccionar archivo
              </button>
            </div>
          )}
          <p className="ayuda">
            El input usa <code>capture="environment"</code> para abrir la cámara trasera en
            teléfonos móviles.
          </p>
        </div>

        <div className="campo campo-ancho">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            rows="3"
            placeholder="Ej. Compra de papel y bolígrafos"
            value={form.observaciones}
            onChange={(e) => setCampo('observaciones', e.target.value)}
          />
        </div>
      </div>

      <div className="form-acciones">
        <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          <Icon nombre="checado" size={16} />
          {guardando ? 'Guardando...' : 'Guardar gasto'}
        </button>
      </div>
    </form>
  )
}