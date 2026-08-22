function Sidebar() {
    return (
        <aside className= "sidebar">
            <nav>
                <ul>
                    <li>Dashboard</li>
                </ul>

                <div className = "sidebar-section">
                    <h2>DOCENTES</h2>
                    <ul>
                        <li>Docentes</li>
                        <li>Currículos</li>
                    </ul>
                </div>

                <div className = "sidebar-section">
                    <h2>PRODUÇÃO</h2>
                    <ul>
                        <li>Produções</li>
                        <li>Projetos</li>
                        <li>Orientações</li>
                    </ul>
                </div>

                <div className = "sidebar-section">
                    <h2>ANÁLISES</h2>
                    <ul>
                        <li>Indicadores</li>
                        <li>Ranking</li>
                        <li>Comparativos</li>
                    </ul>
                </div>

                <div className = "sidebar-section">
                    <h2>MONITORAMENTO</h2>
                    <ul>
                        <li>Alertas</li>
                        <li>Históricos</li>
                    </ul>
                </div>

                <div className = "sidebar-section">
                    <h2>RELATÓRIOS</h2>
                    <ul>
                    <li>Relatórios</li>
                    </ul>
                </div>
                
            </nav>
        </aside>
    );
}

export default Sidebar;