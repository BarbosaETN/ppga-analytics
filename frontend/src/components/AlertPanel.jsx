function AlertPanel () {
    return (
        <div className = "dashboard-panel">
            <h2>Alertas</h2>

            <ul>
                <li>Currículos desatualizados</li>
                <li>Docentes sem produção recente</li>
                <li>Metas não atingidas</li>
            </ul>
        </div>
    ) ;
}

export default AlertPanel;