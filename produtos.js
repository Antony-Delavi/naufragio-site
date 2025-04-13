const produtosDisponiveis = document.getElementById('produtos-disponiveis');
const produtosIndisponiveis = document.getElementById('produtos-indisponiveis');
const searchInput = document.getElementById('searchInput');

let produtos = [];

function carregarProdutos() {
  fetch('https://naufragio-sistema.onrender.com/produtos/buscar')
    .then(res => res.json())
    .then(data => {
      produtos = data;
      renderizarProdutos(produtos);
    })
    .catch(err => {
      console.error('Erro ao carregar produtos:', err);
      alert('Erro ao carregar produtos.');
    });
}

function renderizarProdutos(produtos) {
  produtosDisponiveis.innerHTML = '';
  produtosIndisponiveis.innerHTML = '';

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'card-produto';

    const badgeClass = produto.disponivel ? 'bg-success' : 'bg-danger';
    const badgeText = produto.disponivel ? 'Disponível' : 'Indisponível';

    card.innerHTML = `
      <div class="card-body">
        <h6 class="card-title">${produto.nomeProduto}</h6>
        <p class="mb-1">${produto.categoria}</p>
        <span class="badge ${badgeClass} mb-2">${badgeText}</span><br>
        <small>R$ ${produto.preco.toFixed(2)}</small>
        <div class="mt-auto d-flex gap-2">
          ${produto.disponivel ? `<button onclick="venderProduto('${produto.nomeProduto}')" class="btn btn-sm btn-outline-success">💸</button>` : ''}
          <button onclick="apagarProduto('${produto.nomeProduto}')" class="btn btn-sm btn-outline-danger">🗑️</button>
        </div>
        <div class="detalhes-produto">
          <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
          <p><strong>Marca:</strong> ${produto.marca}</p>
          <p><strong>Valor Original:</strong> R$ ${produto.precoOriginal ? produto.precoOriginal.toFixed(2) : produto.preco.toFixed(2)}</p>
        </div>
      </div>
    `;

    if (produto.disponivel) {
      produtosDisponiveis.appendChild(card);
    } else {
      produtosIndisponiveis.appendChild(card);
    }

    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // Evita expandir ao clicar nos botões
      const detalhes = card.querySelector('.detalhes-produto');
      const isExpanded = detalhes.style.display === 'block';
      detalhes.style.display = isExpanded ? 'none' : 'block';
    });
  });
}

function venderProduto(nomeProduto) {
  const desconto = prompt("Informe o desconto em reais (caso não haja, digite 0):");

  if (desconto === null || desconto === '') return;

  fetch('https://naufragio-sistema.onrender.com/vendas/criar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nomeProduto, desconto })
  })
    .then(res => res.json())
    .then(response => {
      if (response.erro) {
        alert(response.erro);
      } else {
        alert('Venda realizada com sucesso!');
        carregarProdutos();
      }
    })
    .catch(err => {
      console.error('Erro ao vender:', err);
      alert('Erro ao realizar a venda.');
    });
}

function apagarProduto(nomeProduto) {
  const confirmDelete = confirm("Tem certeza que deseja apagar este produto?");
  
  if (confirmDelete) {
    fetch(`https://naufragio-sistema.onrender.com/produtos/deletar/${nomeProduto}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(response => {
      alert('Produto apagado com sucesso!');
      carregarProdutos();
    })
    .catch(err => {
      console.error('Erro ao apagar produto:', err);
      alert('Erro ao apagar o produto.');
    });
  }
}

searchInput.addEventListener('input', function() {
  const query = searchInput.value.toLowerCase();

  const produtosFiltrados = produtos.filter(produto => {
    return (
      produto.nomeProduto.toLowerCase().includes(query) ||
      produto.categoria.toLowerCase().includes(query) ||
      produto.marca.toLowerCase().includes(query)
    );
  });

  renderizarProdutos(produtosFiltrados);
});

carregarProdutos();