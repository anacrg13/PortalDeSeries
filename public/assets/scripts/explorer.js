const API_KEY = '5c77a5ae85f646695da626be56e8bd19'; // Sua chave da API TMDB
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Função para buscar séries pelo nome
async function buscarSeries(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Erro ao buscar séries");
    const data = await res.json();
    return data.results; // Retorna os resultados da busca
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return [];
  }
}

// Renderizar os resultados da busca
function renderizarResultados(series) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Limpa os resultados anteriores

  if (series.length === 0) {
    resultsContainer.innerHTML = '<p class="text-center text-danger">Nenhuma série encontrada.</p>';
    return;
  }

  series.forEach((serie) => {
    const sinopse = serie.overview || 'Sem descrição disponível'; // Exibe a sinopse completa, ou mensagem padrão
    
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="detalhes.html?id=${serie.id}">
        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
      </a>
      <h3>${serie.name}</h3>
      <p>${sinopse}</p>
    `;
    resultsContainer.appendChild(div);
  });
}

// Manipulador do formulário de busca
document.getElementById('search-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o envio do formulário
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;

  const series = await buscarSeries(query);
  renderizarResultados(series);
});
