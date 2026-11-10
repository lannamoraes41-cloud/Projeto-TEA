
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


 // CRIAR PUBLICAÇÃO E SALVAR NO MYSQL
form.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const texto = campoTexto.value.trim();

    if (texto === "") {
        mensagem.textContent = "Escreva uma mensagem para publicar.";
        return;
    }

    try {
        const resposta = await fetch("/api/comunidade/publicacoes", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: texto })
        });

        const dados = await resposta.json();

        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!resposta.ok) {
            throw new Error(dados.mensagem);
        }

        publicacoes.unshift({
            id: dados.id,
            autor: "Você",
            texto: texto,
            data: new Date().toLocaleString("pt-BR"),
            curtidas: 0,
            curtiu: false,
            comentarios: []
        });

        campoTexto.value = "";
        contador.textContent = "0/1000";
        mensagem.textContent = "Publicação salva no MySQL com sucesso!";

        mostrarPublicacoes();

    } catch (erro) {
        console.error("Erro ao publicar:", erro);
        mensagem.textContent = "Não foi possível salvar a publicação.";
    }

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
// CARREGAR PUBLICAÇÕES SALVAS NO MYSQL
async function carregarPublicacoesDoBanco() {
    try {
        const resposta = await fetch("/api/comunidade/publicacoes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar publicações.");
        }

        const dados = await resposta.json();

        publicacoes.length = 0;

        dados.publicacoes.forEach(function(publicacao) {
            publicacoes.push({
                id: publicacao.id,
                autor: publicacao.autor,
                texto: publicacao.texto,
                data: new Date(publicacao.data).toLocaleString("pt-BR"),
                curtidas: Number(publicacao.curtidas),
                curtiu: false,
                comentarios: []
            });
        });

        mostrarPublicacoes();

    } catch (erro) {
        console.error("Erro ao carregar publicações:", erro);
        mensagem.textContent = "Não foi possível carregar as publicações.";
    }
}

carregarPublicacoesDoBanco();