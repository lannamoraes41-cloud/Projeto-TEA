
// TEAJUDA - CENTRAL DE DÚVIDAS
// Protótipo Front-end

const formDuvida = document.querySelector("#form-duvida");
const tituloDuvida = document.querySelector("#titulo-duvida");
const categoriaDuvida = document.querySelector("#categoria-duvida");
const descricaoDuvida = document.querySelector("#descricao-duvida");
const pesquisaDuvidas = document.querySelector("#pesquisar-duvidas");
const listaDuvidas = document.querySelector("#lista-duvidas");
const totalDuvidas = document.querySelector("#total-duvidas");
const mensagemDuvida = document.querySelector("#mensagem-duvida");

let proximoIdDuvida = 3;

const duvidas = [
    {
        id: 1,
        titulo: "Como organizar uma rotina visual?",
        categoria: "Rotina",
        descricao: "Gostaria de conhecer ideias para organizar atividades diárias usando recursos visuais.",
        autor: "Mariana",
        respostas: [
            "Uma sugestão é usar cartões com imagens para representar as atividades do dia."
        ]
    },
    {
        id: 2,
        titulo: "Como melhorar a comunicação com a escola?",
        categoria: "Educação",
        descricao: "Quais estratégias podem ajudar a manter uma boa comunicação entre família e escola?",
        autor: "Carlos",
        respostas: []
    }
];

// CRIAR ELEMENTOS SEM INSERIR HTML DO USUÁRIO
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

// PUBLICAR PERGUNTA
formDuvida.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const titulo = tituloDuvida.value.trim();
    const categoria = categoriaDuvida.value;
    const descricao = descricaoDuvida.value.trim();

    if (!titulo || !categoria || !descricao) {
        mensagemDuvida.textContent =
            "Preencha todos os campos da pergunta.";
        return;
    }

    duvidas.unshift({
        id: proximoIdDuvida++,
        titulo: titulo,
        categoria: categoria,
        descricao: descricao,
        autor: "Você",
        respostas: []
    });

    formDuvida.reset();

    mensagemDuvida.textContent =
        "Sua pergunta foi adicionada ao mural.";

    pesquisaDuvidas.value = "";
    mostrarDuvidas();
});

// PESQUISAR
pesquisaDuvidas.addEventListener("input", mostrarDuvidas);

// MOSTRAR PERGUNTAS
function mostrarDuvidas() {
    const termo = pesquisaDuvidas.value.trim().toLowerCase();

    const filtradas = duvidas.filter(function(duvida) {
        return (
            duvida.titulo.toLowerCase().includes(termo) ||
            duvida.categoria.toLowerCase().includes(termo) ||
            duvida.descricao.toLowerCase().includes(termo)
        );
    });

    listaDuvidas.replaceChildren();

    totalDuvidas.textContent =
        filtradas.length + " perguntas";

    if (filtradas.length === 0) {
        listaDuvidas.appendChild(
            criarElemento(
                "p",
                "",
                "Nenhuma pergunta encontrada."
            )
        );
        return;
    }

    filtradas.forEach(function(duvida) {
        const cartao = criarElemento("article", "cartao-duvida");

        const categoria = criarElemento(
            "span", "categoria", duvida.categoria
        );

        const titulo = criarElemento(
            "h4", "", duvida.titulo
        );

        const descricao = criarElemento(
            "p", "", duvida.descricao
        );

        const autor = criarElemento(
            "div",
            "duvida-autor",
            "Pergunta enviada por " + duvida.autor
        );

        const botao = criarElemento(
            "button",
            "btn-responder",
            "💬 Ver respostas (" + duvida.respostas.length + ")"
        );

        botao.type = "button";

        const areaRespostas = criarElemento(
            "div", "area-respostas"
        );

        areaRespostas.hidden = true;

        const listaRespostas = criarElemento("div");

        function atualizarRespostas() {
            listaRespostas.replaceChildren();

            duvida.respostas.forEach(function(resposta) {
                listaRespostas.appendChild(
                    criarElemento("p", "resposta", resposta)
                );
            });

            botao.textContent =
                "💬 Ver respostas (" + duvida.respostas.length + ")";
        }

        atualizarRespostas();

        const formResposta = criarElemento(
            "form", "form-resposta"
        );

        const campoResposta = criarElemento("input");
        campoResposta.type = "text";
        campoResposta.placeholder = "Escreva sua resposta...";
        campoResposta.maxLength = 500;
        campoResposta.required = true;
        campoResposta.setAttribute(
            "aria-label", "Escreva sua resposta"
        );

        const enviar = criarElemento(
            "button", "", "Responder"
        );

        enviar.type = "submit";
        formResposta.append(campoResposta, enviar);

        areaRespostas.append(listaRespostas, formResposta);

        botao.addEventListener("click", function() {
            areaRespostas.hidden = !areaRespostas.hidden;
        });

        formResposta.addEventListener(
            "submit",
            function(evento) {
                evento.preventDefault();

                const resposta = campoResposta.value.trim();

                if (!resposta) {
                    return;
                }

                duvida.respostas.push(resposta);
                campoResposta.value = "";
                atualizarRespostas();
            }
        );

        cartao.append(
            categoria,
            titulo,
            descricao,
            autor,
            botao,
            areaRespostas
        );

        listaDuvidas.appendChild(cartao);
    });
}

mostrarDuvidas();
