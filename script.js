const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const btnSalvar = document.querySelector('#btnSalvar');

const API_URL = 'http://localhost:3000/api/itens';
let itens = [];
let id = undefined; // Definido como undefined para diferenciar entre adição e edição

// Função para abrir o modal
function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sSalario.value = itens[index].salario;
    id = itens[index].id; // Armazena o ID do item a ser editado
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
    id = undefined; // Novo item
  }
}

// Função para abrir o modal para editar um item
function editItem(index) {
  openModal(true, index);
}

// Função para deletar um item
function deleteItem(index) {
  const itemId = itens[index].id; // Obtém o ID do item a ser deletado

  fetch(`${API_URL}/${itemId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        itens.splice(index, 1); // Remove o item do array local
        loadItens(); // Recarrega os itens na tabela
      } else {
        console.error('Erro ao deletar item:', response.statusText);
      }
    })
    .catch(error => console.error('Erro ao deletar item:', error));
}

// Função para inserir um item na tabela
function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função de salvar para criação ou atualização
btnSalvar.onclick = e => {
  e.preventDefault();

  if (sNome.value === '' || sFuncao.value === '' || sSalario.value === '') {
    return;
  }

  const item = {
    nome: sNome.value,
    funcao: sFuncao.value,
    salario: sSalario.value
  };

  if (id !== undefined) {
    // Atualização de item existente
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
      .then(response => response.json())
      .then(updatedItem => {
        const index = itens.findIndex(i => i.id === id);
        itens[index] = updatedItem;
        loadItens();
        modal.classList.remove('active');
      })
      .catch(error => console.error('Erro ao atualizar item:', error));
  } else {
    // Criação de novo item
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })
      .then(response => response.json())
      .then(newItem => {
        itens.push(newItem);
        insertItem(newItem, itens.length - 1);
        modal.classList.remove('active');
      })
      .catch(error => console.error('Erro ao adicionar item:', error));
  }

  id = undefined;
};

// Função para carregar itens da API
function loadItens() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      itens = data;
      tbody.innerHTML = ''; // Limpa o conteúdo atual
      itens.forEach((item, index) => {
        insertItem(item, index);
      });
    })
    .catch(error => console.error('Erro ao carregar itens:', error));
}

// Carregar itens ao carregar a página
document.addEventListener('DOMContentLoaded', loadItens);


class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation
        ? (link.style.animation = "")
        : (link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`);
    });
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    this.animateLinks();
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick);
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li",
);
mobileNavbar.init();
