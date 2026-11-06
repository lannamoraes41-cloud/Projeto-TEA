
// TEAJUDA - EVENTOS
// Protótipo Front-end

// Eventos fictícios para demonstração.
// Não representam inscrições ou programações reais.

const eventos = [
    {
        id: 1,
        titulo: "Autismo e inclusão escolar",
        modalidade: "Online",
        data: "15/03/2027",
        horario: "19h às 20h30",
        local: "Plataforma on-line (exemplo)",
        descricao: "Palestra demonstrativa sobre práticas de inclusão escolar, comunicação entre família e escola e estratégias de acessibilidade.",
        icone: "📚"
    },
    {
        id: 2,
        titulo: "Encontro de famílias e responsáveis",
        modalidade: "Presencial",
        data: "22/03/2027",
        horario: "14h às 17h",
        local: "Brasília - DF (local fictício)",
        descricao: "Encontro demonstrativo para troca de experiências, construção de redes de apoio e acolhimento entre famílias.",
        icone: "💙"
    },
    {
        id: 3,
        titulo: "Comunicação e desenvolvimento",
        modalidade: "Online",
        data: "05/04/2027",
        horario: "18h às 19h30",
        local: "Plataforma on-line (exemplo)",
        descricao: "Oficina demonstrativa sobre diferentes formas de comunicação, recursos de acessibilidade e respeito às necessidades individuais.",
        icone: "💬"
    },
    {
        id: 4,
        titulo: "Oficina de recursos visuais",
        modalidade: "Presencial",
        data: "12/04/2027",
        horario: "9h às 12h",
        local: "Goiânia - GO (local fictício)",
        descricao: "Atividade demonstrativa com ideias para elaborar materiais visuais e organizar atividades do cotidiano.",
        icone: "🎨"
    }
];

const listaEventos = document.querySelector("#lista-eventos");
const pesquisaEventos = document.querySelector("#pesquisar-eventos");
const totalEventos = document.querySelector("#total-eventos");
const botoesFiltro = document.querySelectorAll(".filtro-evento");

const painelDetalhes = document.querySelector("#detalhes-evento");
const detalheModalidade = document.querySelector("#detalhe-modalidade");
const detalheTitulo = document.querySelector("#detalhe-titulo");
const detalheData = document.querySelector("#detalhe-data");
const detalheHorario = document.querySelector("#detalhe-horario");
const detalheLocal = document.querySelector("#detalhe-local");
const detalheDescricao = document.querySelector("#detalhe-descricao");

const botaoInteresse = document.querySelector("#btn-interesse");
const mensagemInteresse = document.querySelector("#mensagem-interesse");

let filtroAtual = "Todos";
let eventoSelecionado = null;

// Interesse mantido apenas enquanto a página estiver aberta
const interesses = new Set();

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

// MOSTRAR EVENTOS
function mostrarEventos() {
    const termo = pesquisaEventos.value.trim().toLowerCase();

    const filtrados = eventos.filter(function(evento) {
        const correspondeFiltro =
            filtroAtual === "Todos" ||
            evento.modalidade === filtroAtual;

        const correspondePesquisa = [
            evento.titulo,
            evento.modalidade,
            evento.local,
            evento.descricao
        ].some(function(valor) {
            return valor.toLowerCase().includes(termo);
        });

        return correspondeFiltro && correspondePesquisa;
    });

    listaEventos.replaceChildren();

    totalEventos.textContent =
        filtrados.length + " eventos";

    if (filtrados.length === 0) {
        listaEventos.appendChild(
            criarElemento(
                "p", "",
                "Nenhum evento encontrado."
            )
        );
        return;
    }

    filtrados.forEach(function(evento) {
        const cartao = criarElemento("article", "cartao-evento");

        const icone = criarElemento(
            "div", "evento-icone", evento.icone
        );

        const modalidade = criarElemento(
            "span", "evento-modalidade", evento.modalidade
        );

        const titulo = criarElemento(
            "h4", "", evento.titulo
        );

        const dados = criarElemento("div", "evento-dados");

        dados.appendChild(
            criarElemento("p", "", "📅 " + evento.data)
        );

        dados.appendChild(
            criarElemento("p", "", "🕒 " + evento.horario)
        );

        dados.appendChild(
            criarElemento("p", "", "📍 " + evento.local)
        );

        const botao = criarElemento(
            "button", "btn-detalhes", "Ver detalhes"
        );

        botao.type = "button";

        botao.addEventListener("click", function() {
            abrirDetalhes(evento.id);
        });

        cartao.append(
            icone, modalidade, titulo, dados, botao
        );

        listaEventos.appendChild(cartao);
    });
}

// FILTROS
botoesFiltro.forEach(function(botao) {
    botao.addEventListener("click", function() {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(function(outroBotao) {
            const ativo = outroBotao === botao;

            outroBotao.classList.toggle("ativo", ativo);
            outroBotao.setAttribute(
                "aria-pressed", String(ativo)
            );
        });

        mostrarEventos();
    });
});

// PESQUISA
pesquisaEventos.addEventListener("input", mostrarEventos);

// DETALHES DO EVENTO
function abrirDetalhes(id) {
    eventoSelecionado = eventos.find(function(evento) {
        return evento.id === id;
    });

    if (!eventoSelecionado) {
        return;
    }

    detalheModalidade.textContent =
        eventoSelecionado.modalidade;

    detalheTitulo.textContent =
        eventoSelecionado.titulo;

    detalheData.textContent =
        "📅 Data: " + eventoSelecionado.data;

    detalheHorario.textContent =
        "🕒 Horário: " + eventoSelecionado.horario;

    detalheLocal.textContent =
        "📍 Local: " + eventoSelecionado.local;

    detalheDescricao.textContent =
        eventoSelecionado.descricao;

    atualizarInteresse();

    painelDetalhes.hidden = false;

    painelDetalhes.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// INTERESSE NO EVENTO
function atualizarInteresse() {
    const interessado =
        interesses.has(eventoSelecionado.id);

    botaoInteresse.textContent = interessado
        ? "Remover interesse"
        : "Tenho interesse";

    mensagemInteresse.textContent = interessado
        ? "Você demonstrou interesse neste evento de exemplo. Isso não é uma inscrição real."
        : "Este é um evento fictício para testar o TEAjuda. Nenhuma inscrição será realizada.";
}

botaoInteresse.addEventListener("click", function() {
    if (!eventoSelecionado) {
        return;
    }

    const id = eventoSelecionado.id;

    if (interesses.has(id)) {
        interesses.delete(id);
    } else {
        interesses.add(id);
    }

    atualizarInteresse();
});

// FECHAR DETALHES
document.querySelector("#fechar-detalhes")
    .addEventListener("click", function() {
        painelDetalhes.hidden = true;
        eventoSelecionado = null;

        document.querySelector(".eventos-lista-topo")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });

mostrarEventos();
