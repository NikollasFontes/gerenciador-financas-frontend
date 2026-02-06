import { useEffect, useState } from "react";
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
import ModalErro from "../../components/ModalErro";

export default function ModalCategoria({ open, onClose, onSubmit, categoria, categorias }) {
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState(null);

  const [erroAberto, setErroAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    if (open && categoria) {
      setDescricao(categoria.descricao ?? "");
      setFinalidade(
        categoria.finalidade !== undefined && categoria.finalidade !== null
          ? Number(categoria.finalidade)
          : null
      );
    } else {
      setDescricao("");
      setFinalidade(null);
    }
  }, [open, categoria]);

  const handleSubmit = () => {
    if (!descricao.trim()) {
      setMensagemErro("Não é possível cadastrar uma categoria sem nome.");
      setErroAberto(true);
      return;
    }

    if (finalidade === null || finalidade === undefined || isNaN(finalidade)) {
      setMensagemErro("Não é possível cadastrar uma categoria sem finalidade.");
      setErroAberto(true);
      return;
    }

    const existe = categorias?.some(
      (c) =>
        c.descricao.trim().toLowerCase() === descricao.trim().toLowerCase() &&
        c.id !== categoria?.id
    );

    if (existe) {
      setMensagemErro("Já existe uma categoria com este nome. Escolha outro nome.");
      setErroAberto(true);
      return;
    }

    onSubmit({ descricao, finalidade: Number(finalidade) });
  };

  return (
    <>
      {/* 🔹 modal menor e responsiva */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {categoria ? "Editar Categoria" : "Cadastrar Categoria"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Descrição ocupa metade da largura em desktop */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Finalidade ocupa a outra metade */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Finalidade"
                select
                value={finalidade !== null && finalidade !== undefined ? finalidade : ""}
                onChange={(e) => setFinalidade(parseInt(e.target.value))}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={0}>Despesa</MenuItem>
                <MenuItem value={1}>Receita</MenuItem>
                <MenuItem value={2}>Ambas</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {categoria ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ModalErro
        open={erroAberto}
        onClose={() => setErroAberto(false)}
        titulo="Erro em Categorias"
        mensagem={mensagemErro}
      />
    </>
  );
}