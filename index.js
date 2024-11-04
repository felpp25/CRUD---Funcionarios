const express = require('express');
const cors = require('cors'); // Adicione esta linha para importar o cors
const app = express();
const PORT = 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para interpretar JSON
app.use(express.json());

// Dados em memória (simulação de banco de dados)
let itens = [
  // Exemplo de item: { id: 1, nome: 'João', funcao: 'Desenvolvedor', salario: 5000 }
];

// Gerador de ID
let currentId = 1;

// Rota para obter todos os itens
app.get('/api/itens', (req, res) => {
  res.json(itens);
});

// Rota para obter um item específico por ID
app.get('/api/itens/:id', (req, res) => {
  const item = itens.find(i => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item não encontrado' });
  }
});

// Rota para adicionar um novo item
app.post('/api/itens', (req, res) => {
  const { nome, funcao, salario } = req.body;

  // Verifica se todos os campos obrigatórios estão presentes
  if (!nome || !funcao || typeof salario === 'undefined') {
    return res.status(400).json({ message: 'Todos os campos (nome, funcao, salario) são obrigatórios' });
  }

  const newItem = { id: currentId++, nome, funcao, salario };
  itens.push(newItem);
  res.status(201).json(newItem);
});

// Rota para atualizar um item
app.put('/api/itens/:id', (req, res) => {
  const { nome, funcao, salario } = req.body;
  const itemIndex = itens.findIndex(i => i.id === parseInt(req.params.id));

  // Verifica se o item existe
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item não encontrado' });
  }

  // Verifica se os campos obrigatórios foram enviados no corpo da requisição
  if (!nome || !funcao || typeof salario === 'undefined') {
    return res.status(400).json({ message: 'Todos os campos (nome, funcao, salario) são obrigatórios' });
  }

  // Atualiza o item
  itens[itemIndex] = { id: parseInt(req.params.id), nome, funcao, salario };
  res.json(itens[itemIndex]);
});

// Rota para deletar um item
app.delete('/api/itens/:id', (req, res) => {
  const itemIndex = itens.findIndex(i => i.id === parseInt(req.params.id));

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item não encontrado' });
  }

  // Remove o item da lista
  itens.splice(itemIndex, 1);
  res.json({ message: 'Item deletado com sucesso' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
