import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Gerenciador de Finanças</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/pessoas" style={{ marginRight: "10px" }}>Pessoas</Link>
        <Link to="/categorias" style={{ marginRight: "10px" }}>Categorias</Link>
        <Link to="/transacoes">Transações</Link>
      </nav>

      {/* Aqui o React Router renderiza o conteúdo da rota */}
      <Outlet />
    </div>
  );
}