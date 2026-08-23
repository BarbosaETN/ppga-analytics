import DashboardCard from "../components/DashboardCard";
import ProductionPanel from "../components/ProductionPanel";
import AlertPanel from "../components/AlertPanel";
import RankingPanel from "../components/RankingPanel";

function Dashboard() {
    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Visão geral do PPGA Analytics</p>
            </div>

            <section className = "dashboard-cards">
                <DashboardCard
                    titulo = "Produção recente"
                    valor = "128"
                    descricao = "últimos 4 anos"
                />

                <DashboardCard
                    titulo = "Docentes sem produção"
                    valor = "4"
                    descricao = "período configurado"
                />

                <DashboardCard
                    titulo = "Projetos ativos"
                    valor = "18"
                    descricao = "no programa"
                />
            </section>

            <section className = "dashboard-content">
                <ProductionPanel />
                <AlertPanel />
            </section>

            <RankingPanel />

        </div>
    );
}
export default Dashboard;