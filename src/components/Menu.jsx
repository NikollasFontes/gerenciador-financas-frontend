// src/components/Menu.jsx
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // 🔹 centraliza os itens
            width: "100%",
            gap: 3, // espaço entre os botões
          }}
        >
          <Button component={Link} to="/pessoas" sx={{ color: "#fff" }}>
            Pessoas
          </Button>
          <Button component={Link} to="/categorias" sx={{ color: "#fff" }}>
            Categorias
          </Button>
          <Button component={Link} to="/transacoes" sx={{ color: "#fff" }}>
            Gerenciador de Finanças
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Menu;