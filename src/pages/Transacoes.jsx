// src/pages/Transacoes.jsx
import { useEffect, useState } from "react";
import GerenciadorApp from "../api/GerenciadorApp";
import ModalTransacao from "./TransacaoFormularios/ModalTransacao";

import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);

  useEffect(() => {
    GerenciadorApp.get("/transacao")
      .then((response) => setTransacoes(response.data))
      .catch((error) => console.error("Erro ao buscar transações:", error));
  }, []);

  const abrirCadastro = () => {
    setTransacaoSelecionada(null);
    setModalAberto(true);
  };

  const abrirEdicao = (transacao) => {
    setTransacaoSelecionada(transacao);
    setModalAberto(true);
  };

  const handleSalvarTransacao = (dados) => {
    if (transacaoSelecionada) {
      GerenciadorApp.put(`/transacao/${transacaoSelecionada.id}`, dados)
        .then((response) => {
          setTransacoes((prev) =>
            prev.map((t) => (t.id === response.data.id ? response.data : t))
          );
          setTransacaoSelecionada(null);
          setModalAberto(false);
        })
        .catch((error) => console.error("Erro ao editar transação:", error));
    } else {
      GerenciadorApp.post("/transacao", dados)
        .then((response) => {
          setTransacoes((prev) => [...prev, response.data]);
          setModalAberto(false);
        })
        .catch((error) => console.error("Erro ao cadastrar transação:", error));
    }
  };

  const handleExcluir = (id) => {
    GerenciadorApp.delete(`/transacao/${id}`)
      .then(() => setTransacoes((prev) => prev.filter((t) => t.id !== id)))
      .catch((error) => console.error("Erro ao excluir transação:", error));
  };

  const tipoLabel = (valor) => {
    switch (valor) {
      case 0:
        return "Receita";
      case 1:
        return "Despesa";
      default:
        return "Indefinido";
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      {/* 🔹 Título centralizado */}
      <Typography variant="h4" gutterBottom align="center">
        Transações
      </Typography>

      {/* 🔹 Botão centralizado */}
      <Box sx={{ marginBottom: 2, textAlign: "center" }}>
        <Button variant="contained" onClick={abrirCadastro}>
          Cadastrar Transação
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 1100, margin: "0 auto" }}>
        <Table
          sx={{
            border: "1px solid #ddd",
            borderCollapse: "collapse",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Descrição</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Valor</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Tipo</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Categoria</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Pessoa</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Data</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transacoes.map((transacao) => (
              <TableRow key={transacao.id}>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {transacao.descricao || "Sem descrição"}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  R$ {transacao.valor}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {tipoLabel(transacao.tipo)}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {transacao.categoria?.descricao || "Sem categoria"}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {transacao.pessoa?.nome || "Sem pessoa"}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {transacao.data
                    ? new Date(transacao.data).toLocaleDateString("pt-BR")
                    : "Sem data"}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleExcluir(transacao.id)}
                    sx={{ mr: 1 }}
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => abrirEdicao(transacao)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalTransacao
        open={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setTransacaoSelecionada(null);
        }}
        onSubmit={handleSalvarTransacao}
        transacao={transacaoSelecionada}
      />
    </Container>
  );
}

export default Transacoes;