import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import GerenciadorApp from "../../api/GerenciadorApp";
import ModalErro from "../../components/ModalErro";

export default function ModalTransacao({ open, onClose, onSubmit, transacao }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [tipo, setTipo] = useState(1);
  const [categoriaId, setCategoriaId] = useState("");
  const [pessoaId, setPessoaId] = useState("");
  const [data, setData] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  const [erroAberto, setErroAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    if (open) {
      GerenciadorApp.get("/categoria")
        .then((res) => setCategorias(res.data))
        .catch((err) => console.error("Erro ao carregar categorias:", err));

      GerenciadorApp.get("/pessoa")
        .then((res) => setPessoas(res.data))
        .catch((err) => console.error("Erro ao carregar pessoas:", err));
    }
  }, [open]);

  useEffect(() => {
  if (open && transacao) {
    // edição
    setDescricao(transacao.descricao ?? "");
    setValor(transacao.valor ?? 0);
    setTipo(transacao.tipo ?? 1);
    setCategoriaId(transacao.categoriaId ?? "");
    setPessoaId(transacao.pessoaId ?? "");
    setData(
      transacao.data
        ? new Date(transacao.data).toISOString().split("T")[0]
        : ""
    );
  } else if (open && !transacao) {
    // novo cadastro → limpa os campos
    setDescricao("");
    setValor(0);
    setTipo(1);
    setCategoriaId("");
    setPessoaId("");
    setData("");
  }
}, [open, transacao]);


  const handleSubmit = () => {
    const pessoaSelecionada = pessoas.find((p) => p.id === pessoaId);

    if (tipo === 0 && pessoaSelecionada && pessoaSelecionada.idade < 18) {
      setMensagemErro("Não é possível cadastrar RECEITA para usuário menor de 18 anos.");
      setErroAberto(true);
      return;
    }

    onSubmit({
      descricao,
      valor,
      tipo,
      categoriaId,
      pessoaId,
      data,
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {transacao ? "Editar Transação" : "Cadastrar Transação"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Valor *"
                type="number"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value))}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tipo *"
                select
                value={tipo}
                onChange={(e) => setTipo(parseInt(e.target.value))}
                fullWidth
                margin="normal"
              >
                <MenuItem value={0}>Receita</MenuItem>
                <MenuItem value={1}>Despesa</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Categoria *"
                select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                fullWidth
                margin="normal"
              >
                {categorias.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.descricao}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Pessoa *"
                select
                value={pessoaId}
                onChange={(e) => setPessoaId(e.target.value)}
                fullWidth
                margin="normal"
              >
                {pessoas.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Data *"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {transacao ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ModalErro
        open={erroAberto}
        onClose={() => setErroAberto(false)}
        titulo="Erro em Transações"
        mensagem={mensagemErro}
      />
    </>
  );
}