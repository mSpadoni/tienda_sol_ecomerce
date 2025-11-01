const notificacionesDesplegable = () => {
  return (
        <div className="filtro-estado">
            <select value={estado_lectura} onChange={(e) => {setEstadoABuscar(e.target.value);funcionDeFiltrado(notis);}} className="currency-select">
            <option value="">Todas</option>
            <option value="true">Leidas</option>
            <option value="false">No Leidas</option>
          </select>
        </div>
  )
}