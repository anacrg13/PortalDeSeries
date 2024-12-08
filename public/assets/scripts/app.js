const API_KEY = '5c77a5ae85f646695da626be56e8bd19';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const JSON_SERVER_URL = 'http://localhost:3000';

/* Função para carregar séries do carrossel a partir da lista do TMDB */
async function carregarSeriesCarrossel() {
  try {
    const response = await fetch(`${API_BASE_URL}/list/8499897?api_key=${API_KEY}&language=pt-BR`);
    if (!response.ok) throw new Error("Erro ao buscar a lista de séries");
    const data = await response.json();
    return data.items; // `items` contém os detalhes das séries na lista
  } catch (error) {
    console.error("Erro ao carregar as séries do carrossel:", error);
  }
}

/* Renderizar o carrossel */
async function renderizarCarrossel() {
  const series = await carregarSeriesCarrossel();
  const carouselInner = document.querySelector('.carousel-inner');

  if (!series || series.length === 0) {
    carouselInner.innerHTML = `<p class="text-center text-danger">Nenhuma série disponível no momento.</p>`;
    return;
  }

  carouselInner.innerHTML = ''; // Limpa o conteúdo anterior

  series.forEach((serie, index) => {
    const activeClass = index === 0 ? 'active' : ''; // Define a classe 'active' para o primeiro item
    const descricao = serie.overview || "Sem descrição disponível"; // Verifica se há descrição disponível

    const serieHTML = `
      <div class="carousel-item ${activeClass}">
        <a href="detalhes.html?id=${serie.id}">
          <img src="https://image.tmdb.org/t/p/w780${serie.backdrop_path}" class="d-block w-100" alt="${serie.name}">
        </a>
        <div class="carousel-caption d-none d-md-block">
          <h5>${serie.name}</h5>
          <p>${descricao}</p>
        </div>
      </div>
    `;
    carouselInner.innerHTML += serieHTML;
  });
}

/* Função para carregar dados do autor */
async function carregarPerfil() {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/perfil`);
    if (!response.ok) throw new Error("Erro ao buscar perfil");
    const perfil = await response.json();

    // Insere os dados do autor no HTML
    document.querySelector('.perfil-container').innerHTML = `
      <img src="${perfil.avatar}" alt="${perfil.nome}">
      <h5>${perfil.nome}</h5>
      <p>${perfil.minibio}</p>
      <ul>
        <li><a href="mailto:${perfil.email}" target="_blank">E-mail</a></li>
        <li><a href="${perfil.instagram}" target="_blank">Instagram</a></li>
      </ul>
    `;
  } catch (error) {
    console.error("Erro ao carregar o perfil:", error);
    document.querySelector('.perfil-container').innerHTML = `<p>Erro ao carregar dados do autor.</p>`;
  }
}

/* Função para carregar as séries favoritas do JSON Server */
async function carregarMinhasSeries() {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/favoritos`);
    if (!response.ok) throw new Error("Erro ao buscar séries favoritas");
    const favoritos = await response.json();

    const container = document.querySelector('#minhas-series .cards-container');
    container.innerHTML = favoritos
      .map(
        (serie) => `
      <div class="card">
        <a href="detalhes.html?id=${serie.id}">
          <img src="${serie.poster_path}" alt="${serie.name}">
        </a>
        <h3>${serie.name}</h3>
        <p>${serie.overview || "Sem descrição disponível"}</p>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error("Erro ao carregar séries favoritas:", error);
    document.querySelector(
      '#minhas-series .cards-container'
    ).innerHTML = `<p>Erro ao carregar séries favoritas.</p>`;
  }
}

/* Função para carregar novas séries */
async function carregarNovasSeries() {
  try {
    // Fazendo a requisição para obter as séries da lista específica (8500298)
    const response = await fetch(`${API_BASE_URL}/list/8500298?api_key=${API_KEY}&language=pt-BR`);
    if (!response.ok) throw new Error("Erro ao buscar novas séries da lista específica");
    const data = await response.json();

    // Container para os cards de novas séries
    const container = document.querySelector('#novas-series .cards-container');
    container.innerHTML = ''; // Limpa o conteúdo existente antes de adicionar os novos itens

    // Renderizando os cards das séries
    data.items.forEach(serie => {
      const cardHTML = `
        <div class="card">
          <a href="detalhes.html?id=${serie.id}">
            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
          </a>
          <h3>${serie.name}</h3>
          <p>${serie.overview || "Sem descrição disponível"}</p>
        </div>
      `;
      container.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Erro ao carregar novas séries:", error);
    document.querySelector('#novas-series .cards-container').innerHTML = `<p class="text-center text-danger">Erro ao carregar novas séries.</p>`;
  }
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrossel();
  carregarPerfil();
  carregarMinhasSeries();
  carregarNovasSeries(); // Carregar as novas séries ao iniciar a página
});
