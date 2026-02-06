import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import GerenciadorApp from "../api/GerenciadorApp";
import ModalCategoria from "./CategoriaFormularios/ModalCategoria"; // ✅ caminho corrigido
import ModalErro from "../components/ModalErro";

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const [erroAberto, setErroAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = () => {
    GerenciadorApp.get("/categoria")
      .then((res) => setCategorias(res.data))
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        setMensagemErro("Erro ao carregar categorias.");
        setErroAberto(true);
      });
  };

  const handleCadastrar = () => {
    setCategoriaSelecionada(null);
    setOpenModal(true);
  };

  const handleEditar = (categoria) => {
    setCategoriaSelecionada(categoria);
    setOpenModal(true);
  };

  const handleExcluir = (id) => {
    GerenciadorApp.delete(`/categoria/${id}`)
      .then(() => carregarCategorias())
      .catch((err) => {
        console.error("Erro ao excluir categoria:", err);
        setMensagemErro("Erro ao excluir categoria.");
        setErroAberto(true);
      });
  };

  const handleSubmit = (dados) => {
    if (categoriaSelecionada) {
      GerenciadorApp.put(`/categoria/${categoriaSelecionada.id}`, dados)
        .then(() => {
          carregarCategorias();
          setOpenModal(false);
        })
        .catch((err) => {
          console.error("Erro ao editar categoria:", err);
          setMensagemErro("Erro ao editar categoria.");
          setErroAberto(true);
        });
    } else {
      GerenciadorApp.post("/categoria", dados)
        .then(() => {
          carregarCategorias();
          setOpenModal(false);
        })
        .catch((err) => {
          console.error("Erro ao cadastrar categoria:", err);
          setMensagemErro("Erro ao cadastrar categoria.");
          setErroAberto(true);
        });
    }
  };

  const getFinalidadeDescricao = (finalidade) => {
    switch (Number(finalidade)) {
      case 0:
        return "Despesa";
      case 1:
        return "Receita";
      case 2:
        return "Ambas";
      default:
        return "Outro";
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleCadastrar}>
        Nova Categoria
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Finalidade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.descricao}</TableCell>
                <TableCell>{getFinalidadeDescricao(c.finalidade)}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => handleExcluir(c.id)}
                    sx={{ marginRight: 1 }}
                  >
                    Excluir
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleEditar(c)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalCategoria
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        categoria={categoriaSelecionada}
        categorias={categorias}
      />

      <ModalErro
        open={erroAberto}
        onClose={() => setErroAberto(false)}
        titulo="Erro em Categorias"
        mensagem={mensagemErro}
      />
    </>
  );
}