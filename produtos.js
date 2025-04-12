const produtosDisponiveis = document.getElementById('produtos-disponiveis');
const produtosIndisponiveis = document.getElementById('produtos-indisponiveis');

function carregarProdutos() {
  fetch('https://naufragio-sistema.onrender.com/produtos/buscar')
    .then(res => res.json())
    .then(produtos => {
      produtosDisponiveis.innerHTML = '';
      produtosIndisponiveis.innerHTML = '';

      produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'col';

        const badgeClass = produto.disponivel ? 'bg-success' : 'bg-danger';
        const badgeText = produto.disponivel ? 'Disponível' : 'Indisponível';

        card.innerHTML = `
          <div class="card card-produto border-0 shadow-sm">
            <div class="card-body">
              <h6 class="card-title fw-bold mb-1">${produto.nomeProduto}</h6>
              <p class="info mb-1 text-muted">${produto.categoria}</p>
              <span class="badge ${badgeClass} mb-2">${badgeText}</span><br>
              <small class="text-dark">R$ ${produto.preco}</small>
              <div class="mt-2">
                <button onclick="deletarProduto('${produto._id}')" class="btn btn-sm btn-outline-danger btn-deletar">🗑️</button>
              </div>
            </div>
          </div>
        `;

        if (produto.disponivel) {
          produtosDisponiveis.appendChild(card);
        } else {
          produtosIndisponiveis.appendChild(card);
        }
      });
    })
    .catch(err => {
      console.error('Erro ao carregar produtos:', err);
      alert('Erro ao carregar produtos.');
    });
}

function deletarProduto(id) {
  fetch(`https://naufragio-sistema.onrender.com/produtos/deletar/${id}`, {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(response => {
      alert(response.message || 'Produto deletado com sucesso!');
      carregarProdutos();
    })
    .catch(err => {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar o produto.');
    });
}

// Carrega ao iniciar
carregarProdutos();
