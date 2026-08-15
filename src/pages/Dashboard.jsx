import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGastos } from '../hooks/useGastos.js'
import StatCard from '../components/StatCard.jsx'
import Loading from '../components/Loading.jsx'
import ErrorState from '../components/ErrorState.jsx'
import Alert from '../components/Alert.jsx'
import Modal from '../components/Modal.jsx'
import { formatCurrency, redondear } from '../utils/formatCurrency.js'
import { hoyISO, formatearFecha } from '../utils/formatDate.js'
import { Icon } from '../components/Icons.jsx'

/**
 * Dashboard: resumen general de la caja menuda.
 * Muestra tarjetas informativas, gastos recientes y la sección de
 * demostración del consumo de la API pública.
 */
export default function Dashboard() {
  const { gastos, saldoInicial, cargando, cargarGastosEjemploApi, guardarSaldoInicial } =
    useGastos()

  // Estado de la sección de demostración de la API
  const [cargandoApi, setCargandoApi] = useState(false)
  const [errorApi, setErrorApi] = useState(false)
  const [exitoApi, setExitoApi] = useState('')

  // Estado del modal para ajustar el saldo inicial
  const [editarSaldo, setEditarSaldo] = useState(false)
  const [nuevoSaldo, setNuevoSaldo] = useState('')

  // Referencia para cancelar la petición a la API al desmontar
  const abortRef = useRef(null)

  // ---------- CICLO DE VIDA: DESMONTAJE ----------
  // Si el usuario sale de esta página mientras se descargan los datos
  // de la API, se cancela la petición en curso (AbortController).
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  // ---------- CÁLCULOS DEL DASHBOARD ----------
  const hoy = hoyISO()
  const gastosDelDia = gastos.filter((gasto) => gasto.fecha === hoy)
  const totalDelDia = redondear(
    gastosDelDia.reduce((suma, gasto) => suma + Number(gasto.monto), 0),
  )
  const saldoDisponible = redondear(Number(saldoInicial) - totalDelDia)
  const recientes = [...gastos]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)

  // ---------- ACCIONES ----------
  // Ejecuta la petición GET a la API pública (con carga, error y retry)
  async function cargarEjemplos() {
    setCargandoApi(true)
    setErrorApi(false)
    setExitoApi('')

    const controlador = new AbortController()
    abortRef.current = controlador

    try {
      const cargados = await cargarGastosEjemploApi(controlador.signal)
      setExitoApi(`Se cargaron ${cargados.length} gastos de ejemplo desde la API pública.`)
    } catch (err) {
      // Si la petición fue cancelada (desmontaje) no se muestra error
      if (err.name === 'AbortError') return
      setErrorApi(true)
    } finally {
      setCargandoApi(false)
      abortRef.current = null
    }
  }

  function guardarNuevoSaldo() {
    const valor = Number(nuevoSaldo)
    if (!Number.isNaN(valor) && valor >= 0) {
      guardarSaldoInicial(valor)
    }
    setEditarSaldo(false)
  }

  // Estado inicial / cargando: antes de tener los datos
  if (cargando) return <Loading texto="Cargando el dashboard..." />

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen del estado de la caja menuda.</p>
        </div>
        <Link to="/gastos/nuevo" className="btn btn-primario">
          <Icon nombre="mas" size={16} /> Registrar gasto
        </Link>
      </header>

      {/* Tarjetas informativas */}
      <section className="grid-stats">
        <StatCard
          icono="billete"
          etiqueta="Saldo inicial"
          valor={formatCurrency(saldoInicial)}
          sub="Dinero asignado a la caja"
          tono="primario"
        />
        <StatCard
          icono="lista"
          etiqueta="Gastos del día"
          valor={formatCurrency(totalDelDia)}
          sub={formatearFecha(hoy)}
          tono="secundario"
        />
        <StatCard
          icono="checado"
          etiqueta="Saldo disponible"
          valor={formatCurrency(saldoDisponible)}
          sub="Saldo inicial - gastos del día"
          tono="exito"
        />
        <StatCard
          icono="caja"
          etiqueta="Cantidad de gastos"
          valor={`${gastosDelDia.length} gastos`}
          sub="Del día de hoy"
          tono="info"
        />
      </section>

      <div className="acciones-superiores">
        <button type="button" className="btn btn-secundario" onClick={() => { setNuevoSaldo(String(saldoInicial)); setEditarSaldo(true); }}>
          <Icon nombre="editar" size={16} /> Ajustar saldo inicial
        </button>
      </div>

      {/* Sección de demostración de la API pública */}
      <section className="tarjeta tarjeta-api">
        <div className="api-cabecera">
          <div>
            <h2>Datos de demostración desde una API pública</h2>
            <p>
              Consume la API REST{' '}
              <a href="https://dummyjson.com" target="_blank" rel="noreferrer">
                DummyJSON
              </a>{' '}
              (GET <code>/products</code>) para cargar gastos de ejemplo con su fotografía.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primario"
            onClick={cargarEjemplos}
            disabled={cargandoApi}
          >
            <Icon nombre="refrescar" size={16} />
            {cargandoApi ? 'Cargando...' : 'Cargar gastos de ejemplo'}
          </button>
        </div>

        {/* Estados: cargando / error (con retry) / éxito */}
        {cargandoApi && <Loading texto="Consultando la API pública..." />}
        {errorApi && !cargandoApi && (
          <ErrorState mensaje="No fue posible cargar los datos de la API." onReintentar={cargarEjemplos} />
        )}
        {exitoApi && !cargandoApi && <Alert tipo="exito" mensaje={exitoApi} onClose={() => setExitoApi('')} />}
      </section>

      {/* Gastos recientes */}
      <section className="tarjeta">
        <div className="seccion-cabecera">
          <h2>Gastos recientes</h2>
          <Link to="/gastos" className="btn btn-secundario">
            Ver todos
          </Link>
        </div>

        {recientes.length === 0 ? (
          <div className="estado-vacio simple">
            <p>No existen gastos registrados.</p>
            <Link to="/gastos/nuevo" className="btn btn-primario">
              <Icon nombre="mas" size={16} /> Registrar primer gasto
            </Link>
          </div>
        ) : (
          <ul className="lista-recientes">
            {recientes.map((gasto) => (
              <li key={gasto.id} className="reciente">
                <div className="reciente-foto">
                  {gasto.imagen ? (
                    <img src={gasto.imagen} alt="" />
                  ) : (
                    <Icon nombre="caja" size={18} />
                  )}
                </div>
                <div className="reciente-info">
                  <strong>{gasto.descripcion}</strong>
                  <span>
                    {formatearFecha(gasto.fecha)} · <span className="badge">{gasto.categoria}</span>
                  </span>
                </div>
                <strong className="reciente-monto">{formatCurrency(gasto.monto)}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal para editar el saldo inicial */}
      <Modal
        abierto={editarSaldo}
        titulo="Ajustar saldo inicial"
        onClose={() => setEditarSaldo(false)}
        ancho="sm"
      >
        <div className="modal-form">
          <label htmlFor="saldo-inicial">Nuevo saldo inicial (B/.)</label>
          <input
            id="saldo-inicial"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={nuevoSaldo}
            onChange={(e) => setNuevoSaldo(e.target.value)}
            autoFocus
          />
          <div className="confirmar-acciones">
            <button type="button" className="btn btn-secundario" onClick={() => setEditarSaldo(false)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primario" onClick={guardarNuevoSaldo}>
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}