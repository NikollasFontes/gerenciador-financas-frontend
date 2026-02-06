import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import ModalErro from "../../components/ModalErro"; // 🔹 modal genérica de erro

export default function ModalPessoa({ open, onClose, onSubmit, pessoa }) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);

  const [erroAberto, setErroAberto] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    if (pessoa) {
      setNome(pessoa.nome ?? "");
      setIdade(pessoa.idade ?? 0);
    } else {
      setNome("");
      setIdade(0);
    }
  }, [pessoa]);

  const handleSubmit = () => {
    //Validação de idade
    if (idade <= 0) {
      setMensagemErro("Não é possível cadastrar uma pessoa com idade menor ou igual a zero.");
      setErroAberto(true);
      return;
    }

    onSubmit({ nome, idade });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {pessoa ? "Editar Pessoa" : "Cadastrar Pessoa"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Idade"
                type="number"
                value={idade}
                onChange={(e) => setIdade(parseInt(e.target.value))}
                fullWidth
                margin="normal"
                variant="outlined"
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
            {pessoa ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ModalErro
        open={erroAberto}
        onClose={() => setErroAberto(false)}
        titulo="Erro em Pessoas"
        mensagem={mensagemErro}
      />
    </>
  );
}