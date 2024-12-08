const API_KEY = '5c77a5ae85f646695da626be56e8bd19'; // Sua chave da API TMDB
const API_BASE_URL = 'https://api.themoviedb.org/3';
const JSON_SERVER_URL = 'http://localhost:3000';

// Obter parâmetros da URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Obter detalhes da série
async function carregarDetalhes(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error("Erro ao buscar detalhes da série");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar os detalhes da série:", error);
  }
}

// Renderizar os detalhes da série
function renderizarDetalhes(serie) {
  const detalhesContainer = document.querySelector('.detalhes-container');

  // Formatar a data de lançamento para o formato DD/MM/YYYY
  const dataLancamento = new Date(serie.first_air_date);
  const dataFormatada = `${dataLancamento.getDate().toString().padStart(2, '0')}/${
    (dataLancamento.getMonth() + 1).toString().padStart(2, '0')
  }/${dataLancamento.getFullYear()}`;

  detalhesContainer.innerHTML = `
    <div class="detalhes-img">
      <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
    </div>
    <div class="detalhes-info">
      <h3>${serie.name} (${dataLancamento.getFullYear()})</h3>
      <p><strong>Gênero:</strong> ${serie.genres.map(g => g.name).join(', ')}</p>
      <p><strong>Sinopse:</strong> ${serie.overview || "Sem descrição disponível"}</p>
      <p><strong>Data de lançamento:</strong> ${dataFormatada}</p>
      <p><strong>Quantidade de Temporadas:</strong> ${serie.number_of_seasons}</p>
      <p><strong>Avaliação dos usuários:</strong> ${serie.vote_average}</p>
      <button id="favorito-btn" class="heart-btn"><i class="${isFavorited(serie.id) ? 'fas' : 'far'} fa-heart"></i></button>
    </div>
  `;

  const favoritoBtn = document.getElementById('favorito-btn');
  favoritoBtn.addEventListener('click', () => toggleFavorito(serie.id, serie.name));
}

// Verificar se a série está favoritada no localStorage
function isFavorited(id) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  return favoritos.includes(id);
}

// Adicionar ou remover a série dos favoritos
function toggleFavorito(id, nome) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const heartButton = document.getElementById('favorito-btn').querySelector('i');

  if (favoritos.includes(id)) {
    // Remover dos favoritos
    const index = favoritos.indexOf(id);
    favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    heartButton.classList.remove('fas');
    heartButton.classList.add('far');
    alert('Série removida dos favoritos!');
  } else {
    // Adicionar aos favoritos
    favoritos.push(id);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    heartButton.classList.remove('far');
    heartButton.classList.add('fas');
    alert('Série adicionada aos favoritos!');
  }
}

// Obter elenco da série
async function carregarElenco(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
    if (!res.ok) throw new Error("Erro ao buscar elenco da série");
    const data = await res.json();
    return data.cast; // Retornar todos os membros do elenco
  } catch (error) {
    console.error("Erro ao carregar o elenco da série:", error);
  }
}

// Renderizar elenco
function renderizarElenco(elenco) {
  const elencoContainer = document.querySelector('.cards-elenco');
  elencoContainer.innerHTML = ''; // Limpa o container antes de adicionar novos itens

  elenco.forEach(ator => {
    if (ator.profile_path) {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${ator.profile_path}" alt="${ator.name}">
        <h5>${ator.name}</h5>
        <p>${ator.character || "Personagem não disponível"}</p>
      `;
      elencoContainer.appendChild(div);
    }
  });
}

// Inicializar
const serieId = getQueryParam('id');
if (serieId) {
  carregarDetalhes(serieId).then(renderizarDetalhes);
  carregarElenco(serieId).then(renderizarElenco);
}
