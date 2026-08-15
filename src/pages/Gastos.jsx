import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGastos } from '../hooks/useGastos.js'
import Skeleton from '../components/Skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ExpenseTable from '../components/ExpenseTable.jsx'
import ExpenseCard from '../components/ExpenseCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ImagePreview from '../components/ImagePreview.jsx'
import Modal from '../components/Modal.jsx'
import { CATEGORIAS } from '../services/api.js'
import { formatearFecha } from '../utils/formatDate.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { Icon } from '../components/Icons.jsx'

const POR_PAGINA = 6

/**
 * Pantalla de gastos: listado con buscador, filtros, ordenamiento,
 * paginación y acciones de ver / editar / eliminar / ver evidencia.
 */
export default function Gastos() {
  const navigate = useNavigate()
  const { gastos, cargando, recargar, eliminarGasto } = useGastos()

  // Filtros y ordenamiento
  const [busqueda, setBusqueda] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [orden, setOrden] = useState('recientes')
  const [pagina, setPagina] = useState(1)

  // Modales
  const [gastoAEliminar, setGastoAEliminar] = useState(null)
  const [gastoDetalle, setGastoDetalle] = useState(null)
  const [imagenVer, setImagenVer] = useState(null)

  // ---------- ACTUALIZACIÓN: se recalcula la lista cuando cambian los filtros ----------
  const filtrados = useMemo(() => {
    let lista = [...gastos]

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase()
      lista = lista.filter((gasto) =>
        `${gasto.descripcion} ${gasto.proveedor || ''} ${gasto.factura || ''}`
          .toLowerCase()
          .includes(q),
      )
    }
    if (fechaFiltro) lista = lista.filter((gasto) => gasto.fecha === fechaFiltro)
    if (categoriaFiltro) lista = lista.filter((gasto) => gasto.categoria === categoriaFiltro)

    switch (orden) {
      case 'recientes':
        lista.sort((a, b) => b.createdAt - a.createdAt)
        break
      case 'antiguos':
        lista.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'monto-mayor':
        lista.sort((a, b) => Number(b.monto) - Number(a.monto))
        break
      case 'monto-menor':
        lista.sort((a, b) => Number(a.monto) - Number(b.monto))
        break
      default:
        break
    }
    return lista
  }, [gastos, busqueda, fechaFiltro, categoriaFiltro, orden])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  // Se vuelve a la primera página al cambiar los filtros
  useEffect(() => {
    setPagina(1)
  }, [busqueda, fechaFiltro, categoriaFiltro, orden])

  function confirmarEliminar() {
    if (gastoAEliminar) eliminarGasto(gastoAEliminar.id)
    setGastoAEliminar(null)
  }

  // ---------- ESTADO: CARGANDO (Skeleton) ----------
  if (cargando) {
    return (
      <div className="pagina">
        <div className="pagina-cabecera">
          <div>
            <h1>Gastos</h1>
            <p>Cargando los gastos registrados...</p>
          </div>
        </div>
        <div className="skeleton-desktop">
          <Skeleton tipo="tabla" cantidad={4} />
        </div>
        <div className="skeleton-movil">
          <Skeleton tipo="tarjetas" cantidad={3} />
        </div>
      </div>
    )
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>Gastos</h1>
          <p>
            {filtrados.length} {filtrados.length === 1 ? 'gasto' : 'gastos'} encontrados
          </p>
        </div>
        <div className="acciones">
          <button type="button" className="btn btn-secundario" onClick={recargar} title="Actualizar datos">
            <Icon nombre="refrescar" size={16} /> Actualizar
          </button>
          <Link to="/gastos/nuevo" className="btn btn-primario">
            <Icon nombre="mas" size={16} /> Registrar gasto
          </Link>
        </div>
      </header>

      {/* Buscador y filtros */}
      <div className="filtros">
        <div className="filtro-busqueda">
          <Icon nombre="buscar" size={18} />
          <input
            type="text"
            placeholder="Buscar por descripción, proveedor o factura..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="campo filtro-campo">
          <input
            type="date"
            aria-label="Filtrar por fecha"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
        <div className="campo filtro-campo">
          <select
            aria-label="Filtrar por categoría"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
        <div className="campo filtro-campo">
          <select
            aria-label="Ordenar"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="monto-mayor">Mayor monto</option>
            <option value="monto-menor">Menor monto</option>
          </select>
        </div>
      </div>

      {/* ---------- ESTADO: SIN RESULTADOS (Empty) ---------- */}
      {filtrados.length === 0 ? (
        <div className="tarjeta">
          <EmptyState
            titulo="No existen gastos registrados"
            mensaje={
              gastos.length === 0
                ? 'Aún no has registrado ningún gasto.'
                : 'No existen gastos registrados para esta fecha o filtros seleccionados.'
            }
            botonTexto="Registrar primer gasto"
            onBoton={() => navigate('/gastos/nuevo')}
          />
        </div>
      ) : (
        <>
          {/* Tabla en escritorio */}
          <div className="skeleton-desktop">
            <div className="tarjeta">
              <ExpenseTable
                gastos={visibles}
                onVer={setGastoDetalle}
                onEditar={(gasto) => navigate(`/gastos/editar/${gasto.id}`)}
                onEliminar={setGastoAEliminar}
                onVerEvidencia={setImagenVer}
              />
            </div>
          </div>

          {/* Tarjetas en móvil */}
          <div className="skeleton-movil">
            <div className="lista-tarjetas">
              {visibles.map((gasto) => (
                <ExpenseCard
                  key={gasto.id}
                  gasto={gasto}
                  onVer={setGastoDetalle}
                  onEditar={(g) => navigate(`/gastos/editar/${g.id}`)}
                  onEliminar={setGastoAEliminar}
                  onVerEvidencia={setImagenVer}
                />
              ))}
            </div>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                type="button"
                className="btn btn-secundario"
                disabled={paginaActual <= 1}
                onClick={() => setPagina(paginaActual - 1)}
              >
                <Icon nombre="chevron-izq" size={16} /> Anterior
              </button>
              <span>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                type="button"
                className="btn btn-secundario"
                disabled={paginaActual >= totalPaginas}
                onClick={() => setPagina(paginaActual + 1)}
              >
                Siguiente <Icon nombre="chevron-der" size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal: detalle del gasto */}
      <Modal
        abierto={Boolean(gastoDetalle)}
        titulo="Detalle del gasto"
        onClose={() => setGastoDetalle(null)}
      >
        {gastoDetalle && (
          <div className="detalle-gasto">
            <dl>
              <div>
                <dt>Descripción</dt>
                <dd>{gastoDetalle.descripcion}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formatearFecha(gastoDetalle.fecha)}</dd>
              </div>
              <div>
                <dt>Categoría</dt>
                <dd>
                  <span className="badge">{gastoDetalle.categoria}</span>
                </dd>
              </div>
              <div>
                <dt>Monto</dt>
                <dd className="monto-destacado">{formatCurrency(gastoDetalle.monto)}</dd>
              </div>
              <div>
                <dt>Proveedor</dt>
                <dd>{gastoDetalle.proveedor || '—'}</dd>
              </div>
              <div>
                <dt>Número de factura</dt>
                <dd>{gastoDetalle.factura || '—'}</dd>
              </div>
              <div>
                <dt>Observaciones</dt>
                <dd>{gastoDetalle.observaciones || '—'}</dd>
              </div>
            </dl>
            {gastoDetalle.imagen && (
              <button
                type="button"
                className="btn btn-primario"
                onClick={() => setImagenVer(gastoDetalle)}
              >
                <Icon nombre="imagen" size={16} /> Ver factura / recibo
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Modal: fotografía de la factura */}
      <ImagePreview
        imagen={imagenVer?.imagen}
        descripcion={imagenVer?.descripcion}
        onClose={() => setImagenVer(null)}
      />

      {/* Confirmación antes de eliminar */}
      <ConfirmDialog
        abierto={Boolean(gastoAEliminar)}
        mensaje={
          gastoAEliminar
            ? `¿Estás seguro de eliminar el gasto "${gastoAEliminar.descripcion}"? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirmar={confirmarEliminar}
        onCancelar={() => setGastoAEliminar(null)}
      />
    </div>
  )
}