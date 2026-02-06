import axios from "axios";

const GerenciadorApp = axios.create({
  baseURL: "https://localhost:7088/api", //porta que estou usando para o meu computador
  headers: {
    "Content-Type": "application/json"
  }
});

export default GerenciadorApp;