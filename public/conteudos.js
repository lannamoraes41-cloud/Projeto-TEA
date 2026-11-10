
// TEAJUDA - BIBLIOTECA DE CONTEÚDOS
// Protótipo Front-end

const conteudos = [
    {
        id: 1,
        categoria: "Entendendo o TEA",
        icone: "🧩",
        titulo: "O que é o Transtorno do Espectro Autista?",
        resumo: "Conheça características do TEA e entenda por que cada pessoa autista é única.",
        paragrafos: [
            "O Transtorno do Espectro Autista (TEA) é uma condição do neurodesenvolvimento relacionada a diferenças na comunicação, na interação social e em padrões de comportamento, interesses ou atividades.",
            "O termo espectro representa a grande diversidade de características, necessidades de apoio e habilidades das pessoas autistas. Não existe uma única maneira de ser autista.",
            "O reconhecimento das necessidades individuais e o acesso a ambientes acolhedores podem favorecer a participação, a autonomia e a qualidade de vida."
        ]
    },
    {
        id: 2,
        categoria: "Educação",
        icone: "📚",
        titulo: "Inclusão escolar e aprendizagem",
        resumo: "Entenda a importância de uma escola acessível, inclusiva e acolhedora.",
        paragrafos: [
            "A educação inclusiva busca garantir a participação e a aprendizagem de todos os estudantes, respeitando suas características individuais.",
            "Recursos visuais, comunicação acessível, adaptações pedagógicas e diálogo entre escola e família podem contribuir para o processo educativo.",
            "As estratégias devem ser escolhidas considerando as necessidades de cada estudante, sem pressupor que todas as pessoas autistas aprendem da mesma forma."
        ]
    },
    {
        id: 3,
        categoria: "Rotina",
        icone: "📅",
        titulo: "Organizando uma rotina visual",
        resumo: "Conheça formas de tornar atividades diárias mais previsíveis.",
        paragrafos: [
            "Uma rotina visual utiliza imagens, símbolos ou palavras para representar as atividades previstas ao longo do dia.",
            "Esse recurso pode ajudar algumas pessoas a compreender a sequência das tarefas e antecipar mudanças.",
            "É importante adaptar a rotina à idade, às preferências e às necessidades da pessoa, mantendo espaço para flexibilidade e escolhas."
        ]
    },
    {
        id: 4,
        categoria: "Direitos",
        icone: "⚖️",
        titulo: "Direitos das pessoas autistas",
        resumo: "Conheça princípios importantes de inclusão e proteção de direitos no Brasil.",
        paragrafos: [
            "No Brasil, a Lei nº 12.764/2012 instituiu a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista.",
            "Para efeitos legais, a pessoa com TEA é considerada pessoa com deficiência, conforme a legislação brasileira.",
            "O acesso a direitos e benefícios específicos depende das regras aplicáveis a cada situação. Para orientações individuais, procure os órgãos públicos competentes ou assistência jurídica."
        ]
    },
    {
        id: 5,
        categoria: "Entendendo o TEA",
        icone: "💬",
        titulo: "Comunicação e diferentes formas de expressão",
        resumo: "Saiba por que a comunicação pode acontecer de muitas maneiras.",
        paragrafos: [
            "A comunicação não se limita à fala. Gestos, expressões, escrita, imagens e tecnologias assistivas também podem ser formas importantes de expressão.",
            "Algumas pessoas autistas utilizam recursos de comunicação alternativa ou aumentativa para expressar necessidades, sentimentos e escolhas.",
            "Respeitar o tempo de resposta, ouvir atentamente e oferecer formas acessíveis de comunicação são atitudes importantes."
        ]
    },
    {
        id: 6,
        categoria: "Rotina",
        icone: "💙",
        titulo: "Acolhimento e respeito às diferenças",
        resumo: "Pequenas atitudes podem tornar os ambientes mais acolhedores.",
        paragrafos: [
            "O acolhimento começa com o respeito às experiências e às necessidades de cada pessoa.",
            "Perguntar sobre preferências, evitar julgamentos e considerar questões sensoriais pode contribuir para ambientes mais acessíveis.",
            "O objetivo da inclusão é permitir participação com dignidade, autonomia e respeito à individualidade."
        ]
    }
];

const pesquisa = document.querySelector("#pesquisa-conteudo");
const lista = document.querySelector("#lista-conteudos");
const total = document.querySelector("#total-conteudos");
const filtros = document.querySelectorAll(".filtro");

const leitor = document.querySelector("#leitor-conteudo");
const categoriaArtigo = document.querySelector("#categoria-artigo");
const tituloArtigo = document.querySelector("#titulo-artigo");
const corpoArtigo = document.querySelector("#corpo-artigo");
const fecharArtigo = document.querySelector("#fechar-artigo");

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

// EXIBIR CARTÕES
function mostrarConteudos() {
    const termo = pesquisa.value.trim().toLowerCase();

    const filtrados = conteudos.filter(function(item) {
        const correspondeCategoria =
            categoriaAtual === "Todos" ||
            item.categoria === categoriaAtual;

        const correspondePesquisa =
            item.titulo.toLowerCase().includes(termo) ||
            item.resumo.toLowerCase().includes(termo) ||
            item.categoria.toLowerCase().includes(termo);

        return correspondeCategoria && correspondePesquisa;
    });

    lista.replaceChildren();

    total.textContent = filtrados.length + " materiais";

    if (filtrados.length === 0) {
        lista.appendChild(
            criarElemento(
                "p",
                "",
                "Nenhum conteúdo encontrado para esta pesquisa."
            )
        );
        return;
    }

    filtrados.forEach(function(item) {
        const cartao = criarElemento("article", "cartao-conteudo");

        const icone = criarElemento(
            "div", "icone-conteudo", item.icone
        );

        const categoria = criarElemento(
            "span", "categoria-conteudo", item.categoria
        );

        const titulo = criarElemento(
            "h4", "", item.titulo
        );

        const resumo = criarElemento(
            "p", "", item.resumo
        );

        const botao = criarElemento(
            "button", "btn-ler", "Ler conteúdo"
        );

        botao.type = "button";

        botao.addEventListener("click", function() {
            abrirConteudo(item.id);
        });

        cartao.append(icone, categoria, titulo, resumo, botao);
        lista.appendChild(cartao);
    });
}

// FILTRAR POR CATEGORIA
filtros.forEach(function(botao) {
    botao.addEventListener("click", function() {
        categoriaAtual = botao.dataset.categoria;

        filtros.forEach(function(outroBotao) {
            const selecionado = outroBotao === botao;

            outroBotao.classList.toggle("ativo", selecionado);
            outroBotao.setAttribute(
                "aria-pressed",
                String(selecionado)
            );
        });

        mostrarConteudos();
    });
});

// PESQUISAR
pesquisa.addEventListener("input", mostrarConteudos);

// ABRIR ARTIGO
function abrirConteudo(id) {
    const artigo = conteudos.find(function(item) {
        return item.id === id;
    });

    if (!artigo) {
        return;
    }

    categoriaArtigo.textContent = artigo.categoria;
    tituloArtigo.textContent = artigo.titulo;
    corpoArtigo.replaceChildren();

    artigo.paragrafos.forEach(function(paragrafo) {
        corpoArtigo.appendChild(
            criarElemento("p", "", paragrafo)
        );
    });

    leitor.hidden = false;
    leitor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// FECHAR ARTIGO
fecharArtigo.addEventListener("click", function() {
    leitor.hidden = true;
    document.querySelector(".conteudos-resultado")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
});

mostrarConteudos();
