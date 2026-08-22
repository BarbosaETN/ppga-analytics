import Header from "./Header";
import Sidebar from "./Sidebar";

function MainLayout({children}) {
    return (
        <div className="layout">
            <Header titulo="PPGA Analytics" />

            <div className= "layout-body">
                <Sidebar />

                <main className= "main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;