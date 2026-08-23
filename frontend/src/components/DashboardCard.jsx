function DashboardCard ({titulo, valor, descricao}) {
    return (
        <div className = "dashboard-card">
            <h2>{titulo}</h2>
            <strong>{valor}</strong>
            <span>{descricao}</span>
        </div>
    )
}

export default DashboardCard;