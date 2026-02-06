import { useEffect, useState } from "react";
import GerenciadorApp from "../api/GerenciadorApp";
import ModalPessoa from "./PessoaFormularios/ModalPessoa";

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

function Pessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);

  // Buscar pessoas e transações
  useEffect(() => {
    GerenciadorApp.get("/pessoa")
      .then((response) => setPessoas(response.data))
      .catch((error) => console.error("Erro ao buscar pessoas:", error));

    GerenciadorApp.get("/transacao")
      .then((response) => setTransacoes(response.data))
      .catch((error) => console.error("Erro ao buscar transações:", error));
  }, []);

  // Função para calcular totais por pessoa
  const calcularTotais = (pessoaId) => {
    const receitas = transacoes
      .filter((t) => t.tipo === 0 && t.pessoa?.id === pessoaId)
      .reduce((acc, t) => acc + t.valor, 0);

    const despesas = transacoes
      .filter((t) => t.tipo === 1 && t.pessoa?.id === pessoaId)
      .reduce((acc, t) => acc + t.valor, 0);

    const saldo = receitas - despesas;

    return { receitas, despesas, saldo };
  };

  // Totais gerais
  const totalReceitas = transacoes
    .filter((t) => t.tipo === 0)
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === 1)
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoGeral = totalReceitas - totalDespesas;

  const abrirCadastro = () => {
    setPessoaSelecionada(null);
    setModalAberto(true);
  };

  const abrirEdicao = (pessoa) => {
    setPessoaSelecionada(pessoa);
    setModalAberto(true);
  };

  const handleSalvarPessoa = (dados) => {
    if (pessoaSelecionada) {
      GerenciadorApp.put(`/pessoa/${pessoaSelecionada.id}`, dados)
        .then((response) => {
          setPessoas(
            pessoas.map((p) =>
              p.id === response.data.id ? response.data : p
            )
          );
          setPessoaSelecionada(null);
          setModalAberto(false);
        })
        .catch((error) => console.error("Erro ao editar pessoa:", error));
    } else {
      GerenciadorApp.post("/pessoa", dados)
        .then((response) => {
          setPessoas([...pessoas, response.data]);
          setModalAberto(false);
        })
        .catch((error) => console.error("Erro ao cadastrar pessoa:", error));
    }
  };

  const handleExcluir = (id) => {
    GerenciadorApp.delete(`/pessoa/${id}`)
      .then(() => setPessoas(pessoas.filter((p) => p.id !== id)))
      .catch((error) => console.error("Erro ao excluir pessoa:", error));
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Pessoas
      </Typography>

      <Box sx={{ marginBottom: 2, textAlign: "center" }}>
        <Button variant="contained" onClick={abrirCadastro}>
          Cadastrar Pessoa
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
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Nome</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Idade</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Receita</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Despesas</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Saldo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pessoas.map((pessoa) => {
              const { receitas, despesas, saldo } = calcularTotais(pessoa.id);
              return (
                <TableRow key={pessoa.id}>
                  <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                    {pessoa.nome || "Sem nome"}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                    {pessoa.idade || "Sem idade"}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #ddd", color: "green" }}>
                    R$ {receitas.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #ddd", color: "red" }}>
                    R$ {despesas.toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ddd",
                      color: saldo >= 0 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    R$ {saldo.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleExcluir(pessoa.id)}
                      sx={{ mr: 1 }}
                    >
                      Excluir
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => abrirEdicao(pessoa)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* 🔹 Linha de totais gerais */}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                Total de Pessoas: {pessoas.length}
              </TableCell>
              <TableCell sx={{ color: "green", fontWeight: "bold" }}>
                R$ {totalReceitas.toFixed(2)}
              </TableCell>
              <TableCell sx={{ color: "red", fontWeight: "bold" }}>
                R$ {totalDespesas.toFixed(2)}
              </TableCell>
              <TableCell
                sx={{
                  color: saldoGeral >= 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                R$ {saldoGeral.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <ModalPessoa
        open={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setPessoaSelecionada(null);
        }}
        onSubmit={handleSalvarPessoa}
        pessoa={pessoaSelecionada}
      />
    </Container>
  );
}

export default Pessoas;