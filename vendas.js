const container = document.getElementById('vendas-container');

function carregarVendas() {
  fetch('https://naufragio-sistema.onrender.com/vendas/buscarvendas')
    .then(res => res.json())
    .then(vendas => {
      container.innerHTML = '';

      vendas.forEach(venda => {
        const card = document.createElement('div');
        card.className = 'col';

        card.innerHTML = `
          <div class="card shadow-sm venda-card">
            <div class="card-body">
              <h6 class="card-title fw-bold text-primary">${venda.nomeProduto}</h6>
              <p class="mb-1"><strong>Categoria:</strong> ${venda.categoria}</p>
              <p class="mb-1"><strong>Valor:</strong> R$ ${venda.valorProduto}</p>
              <p class="mb-1"><strong>Desconto:</strong> R$ ${venda.desconto}</p>
              <p class="mb-0 text-muted"><small><strong>Data:</strong> ${venda.dataCadastro}</small></p>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar vendas:', err);
      alert('Erro ao carregar vendas.');
    });
}

// Carrega automaticamente ao abrir
carregarVendas();
