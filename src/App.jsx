// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Pessoas from "./pages/Pessoas";
import Categorias from "./pages/Categorias";
import Transacoes from "./pages/Transacoes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Pessoas />} />
        <Route path="pessoas" element={<Pessoas />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="transacoes" element={<Transacoes />} />
      </Route>
    </Routes>
  );
}