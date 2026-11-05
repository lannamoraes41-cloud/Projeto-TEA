
// TEAJUDA - COMUNIDADE
// Demonstração do Front-end

const form = document.querySelector("#form-publicacao");
const campoTexto = document.querySelector("#texto-publicacao");
const contador = document.querySelector("#contador");
const lista = document.querySelector("#lista-publicacoes");
const total = document.querySelector("#total-publicacoes");
const mensagem = document.querySelector("#mensagem-publicacao");

let proximoId = 3;

const publicacoes = [
    {
        id: 1,
        autor: "Mariana",
        texto: "Olá, pessoal! Que bom encontrar um espaço onde podemos compartilhar nossas experiências e aprender juntos. 💙",
        data: "Publicação de exemplo",
        curtidas: 4,
        curtiu: false,
        comentarios: []
    },
    {
        id: 2,
        autor: "Carlos",
        texto: "Cada pequena conquista merece ser celebrada. Desejo uma ótima semana a todos!",
        data: "Publicação de exemplo",
        curtidas: 2,
        curtiu: false,
        comentarios: []
    }
];

// CONTADOR DE CARACTERES
campoTexto.addEventListener("input", function() {
    contador.textContent = campoTexto.value.length + "/1000";
});

// CRIAR PUBLICAÇÃO
form.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const texto = campoTexto.value.trim();

    if (texto === "") {
        mensagem.textContent = "Escreva uma mensagem para publicar.";
        return;
    }

    publicacoes.unshift({
        id: proximoId++,
        autor: "Você",
        texto: texto,
        data: new Date().toLocaleString("pt-BR"),
        curtidas: 0,
        curtiu: false,
        comentarios: []
    });

    campoTexto.value = "";
    contador.textContent = "0/1000";
    mensagem.textContent = "Publicação adicionada ao mural.";

    mostrarPublicacoes();
});

// CRIAR ELEMENTOS COM SEGURANÇA
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

// MOSTRAR PUBLICAÇÕES
function mostrarPublicacoes() {
    lista.replaceChildren();

    total.textContent =
        publicacoes.length + " publicações";

    publicacoes.forEach(function(publicacao) {
        const artigo = criarElemento("article", "publicacao");

        const autor = criarElemento("div", "publicacao-autor");
        const avatar = criarElemento("div", "autor-avatar", "👤");
        const dados = criarElemento("div", "autor-dados");

        dados.appendChild(
            criarElemento("strong", "", publicacao.autor)
        );

        dados.appendChild(
            criarElemento("small", "", publicacao.data)
        );

        autor.append(avatar, dados);

        const texto = criarElemento(
            "p", "publicacao-texto", publicacao.texto
        );

        const acoes = criarElemento("div", "publicacao-acoes");

        const btnCurtir = criarElemento(
            "button",
            publicacao.curtiu ? "curtido" : "",
            "♡ Curtir (" + publicacao.curtidas + ")"
        );

        btnCurtir.type = "button";
        btnCurtir.setAttribute(
            "aria-pressed",
            String(publicacao.curtiu)
        );

        btnCurtir.addEventListener("click", function() {
            publicacao.curtiu = !publicacao.curtiu;
            publicacao.curtidas += publicacao.curtiu ? 1 : -1;
            mostrarPublicacoes();
        });

        const btnComentar = criarElemento(
            "button", "", "💬 Comentar"
        );

        btnComentar.type = "button";

        const comentarios = criarElemento(
            "div", "comentarios"
        );

        comentarios.hidden = true;

        publicacao.comentarios.forEach(function(comentario) {
            comentarios.appendChild(
                criarElemento(
                    "p", "comentario", "Você: " + comentario
                )
            );
        });

        const formComentario = criarElemento(
            "form", "form-comentario"
        );

        const input = criarElemento("input");
        input.type = "text";
        input.placeholder = "Escreva um comentário...";
        input.maxLength = 500;
        input.required = true;
        input.setAttribute("aria-label", "Novo comentário");

        const enviar = criarElemento(
            "button", "", "Enviar"
        );

        enviar.type = "submit";
        formComentario.append(input, enviar);
        comentarios.appendChild(formComentario);

        btnComentar.addEventListener("click", function() {
            comentarios.hidden = !comentarios.hidden;

            if (!comentarios.hidden) {
                input.focus();
            }
        });

        formComentario.addEventListener(
            "submit",
            function(evento) {
                evento.preventDefault();

                const textoComentario = input.value.trim();

                if (!textoComentario) {
                    return;
                }

                publicacao.comentarios.push(textoComentario);

                comentarios.insertBefore(
                    criarElemento(
                        "p",
                        "comentario",
                        "Você: " + textoComentario
                    ),
                    formComentario
                );

                input.value = "";
            }
        );

        acoes.append(btnCurtir, btnComentar);
        artigo.append(autor, texto, acoes, comentarios);
        lista.appendChild(artigo);
    });
}

mostrarPublicacoes();
