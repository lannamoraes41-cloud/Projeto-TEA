
// TEAJUDA - CENTRAL DE RECURSOS
// Protótipo Front-end

const recursos = [
    {
        titulo: "Planejador de rotina",
        categoria: "Organização",
        icone: "📅",
        descricao: "Monte uma lista de atividades e acompanhe sua rotina diária.",
        tipo: "interno",
        destino: "ferramenta-rotina"
    },
    {
        titulo: "Conteúdos educativos",
        categoria: "Educação",
        icone: "📚",
        descricao: "Acesse materiais introdutórios sobre inclusão e aprendizagem.",
        tipo: "interno",
        destino: "conteudos.html"
    },
    {
        titulo: "Direitos da pessoa autista",
        categoria: "Direitos",
        icone: "⚖️",
        descricao: "Consulte a Lei nº 12.764/2012 no portal oficial da legislação brasileira.",
        tipo: "externo",
        destino: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm"
    },
    {
        titulo: "Biblioteca do TEAjuda",
        categoria: "Informação",
        icone: "💙",
        descricao: "Explore os conteúdos educativos organizados por assunto.",
        tipo: "interno",
        destino: "conteudos.html"
    },
    {
        titulo: "Perguntas da comunidade",
        categoria: "Informação",
        icone: "💬",
        descricao: "Compartilhe perguntas e encontre experiências de outras pessoas.",
        tipo: "interno",
        destino: "duvidas.html"
    },
    {
        titulo: "Lei Brasileira de Inclusão",
        categoria: "Direitos",
        icone: "📖",
        descricao: "Conheça a Lei nº 13.146/2015, que trata da inclusão da pessoa com deficiência.",
        tipo: "externo",
        destino: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm"
    }
];

const pesquisaRecursos =
    document.querySelector("#pesquisar-recursos");

const listaRecursos =
    document.querySelector("#lista-recursos");

const totalRecursos =
    document.querySelector("#total-recursos");

const filtrosRecursos =
    document.querySelectorAll(".filtro-recurso");

let categoriaAtual = "Todos";

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

// EXIBIR RECURSOS
function mostrarRecursos() {
    const termo =
        pesquisaRecursos.value.trim().toLowerCase();

    const filtrados = recursos.filter(function(recurso) {
        const categoriaCorreta =
            categoriaAtual === "Todos" ||
            recurso.categoria === categoriaAtual;

        const pesquisaCorreta = [
            recurso.titulo,
            recurso.categoria,
            recurso.descricao
        ].some(function(valor) {
            return valor.toLowerCase().includes(termo);
        });

        return categoriaCorreta && pesquisaCorreta;
    });

    listaRecursos.replaceChildren();

    totalRecursos.textContent =
        filtrados.length + " recursos";

    if (filtrados.length === 0) {
        listaRecursos.appendChild(
            criarElemento("p", "", "Nenhum recurso encontrado.")
        );
        return;
    }

    filtrados.forEach(function(recurso) {
        const cartao = criarElemento("article", "cartao-recurso");

        const icone = criarElemento(
            "div", "icone-recurso", recurso.icone
        );

        const categoria = criarElemento(
            "span", "categoria-recurso", recurso.categoria
        );

        const titulo = criarElemento(
            "h4", "", recurso.titulo
        );

        const descricao = criarElemento(
            "p", "", recurso.descricao
        );

        const link = criarElemento(
            "a", "btn-recurso", "Acessar recurso"
        );

        if (recurso.destino === "ferramenta-rotina") {
            link.href = "#ferramenta-rotina";
        } else {
            link.href = recurso.destino;
        }

        if (recurso.tipo === "externo") {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Consultar fonte oficial";
        }

        cartao.append(
            icone, categoria, titulo, descricao, link
        );

        listaRecursos.appendChild(cartao);
    });
}

// FILTRAR
filtrosRecursos.forEach(function(botao) {
    botao.addEventListener("click", function() {
        categoriaAtual = botao.dataset.categoria;

        filtrosRecursos.forEach(function(outroBotao) {
            const ativo = outroBotao === botao;

            outroBotao.classList.toggle("ativo", ativo);
            outroBotao.setAttribute(
                "aria-pressed", String(ativo)
            );
        });

        mostrarRecursos();
    });
});

// PESQUISAR
pesquisaRecursos.addEventListener("input", mostrarRecursos);

// FERRAMENTA DE ROTINA
const formTarefa = document.querySelector("#form-tarefa");
const campoTarefa = document.querySelector("#nova-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const mensagemTarefas =
    document.querySelector("#mensagem-tarefas");

let proximoIdTarefa = 1;
const tarefas = [];

formTarefa.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const texto = campoTarefa.value.trim();

    if (!texto) {
        mensagemTarefas.textContent =
            "Digite uma atividade para adicionar.";
        return;
    }

    tarefas.push({
        id: proximoIdTarefa++,
        texto: texto,
        concluida: false
    });

    campoTarefa.value = "";
    mensagemTarefas.textContent = "Atividade adicionada.";

    mostrarTarefas();
});

function mostrarTarefas() {
    listaTarefas.replaceChildren();

    if (tarefas.length === 0) {
        mensagemTarefas.textContent =
            "Nenhuma atividade cadastrada.";
        return;
    }

    tarefas.forEach(function(tarefa) {
        const item = criarElemento(
            "li",
            tarefa.concluida
                ? "item-tarefa concluida"
                : "item-tarefa"
        );

        const descricao = criarElemento(
            "label", "tarefa-descricao"
        );

        const checkbox = criarElemento("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarefa.concluida;

        checkbox.addEventListener("change", function() {
            tarefa.concluida = checkbox.checked;
            mostrarTarefas();
        });

        const texto = criarElemento(
            "span", "tarefa-texto", tarefa.texto
        );

        descricao.append(checkbox, texto);

        const excluir = criarElemento(
            "button", "btn-excluir", "Excluir"
        );

        excluir.type = "button";

        excluir.addEventListener("click", function() {
            const indice = tarefas.findIndex(function(item) {
                return item.id === tarefa.id;
            });

            if (indice !== -1) {
                tarefas.splice(indice, 1);
            }

            mostrarTarefas();
        });

        item.append(descricao, excluir);
        listaTarefas.appendChild(item);
    });
}

mostrarRecursos();
mostrarTarefas();
