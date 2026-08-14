import Header from "./components/Header";
import Sidebar from"./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Header titulo="PPGA ANALYTICS"/>
      
      <Sidebar />

      <Dashboard />
    </>
  ); 
}

export default App;
