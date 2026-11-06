
// TEAJUDA - CONFIGURAÇÕES
// Protótipo Front-end com localStorage

const CHAVE_CONFIG = "teajuda_configuracoes_demo";

const configuracoesPadrao = {
    notificarRespostas: true,
    notificarEventos: true,
    notificarComunidade: false,
    perfilPublico: false,
    mostrarCidade: false,
    tema: "claro",
    fonte: "normal"
};

const formConfig = document.querySelector("#form-configuracoes");
const mensagemConfig =
    document.querySelector("#mensagem-configuracoes");

const campos = {
    notificarRespostas:
        document.querySelector("#notificar-respostas"),

    notificarEventos:
        document.querySelector("#notificar-eventos"),

    notificarComunidade:
        document.querySelector("#notificar-comunidade"),

    perfilPublico:
        document.querySelector("#perfil-publico"),

    mostrarCidade:
        document.querySelector("#mostrar-cidade"),

    tema:
        document.querySelector("#tema-site"),

    fonte:
        document.querySelector("#tamanho-fonte")
};

// CARREGAR CONFIGURAÇÕES
function carregarConfiguracoes() {
    try {
        const dados = localStorage.getItem(CHAVE_CONFIG);

        if (!dados) {
            return { ...configuracoesPadrao };
        }

        return {
            ...configuracoesPadrao,
            ...JSON.parse(dados)
        };
    } catch (erro) {
        return { ...configuracoesPadrao };
    }
}

// PREENCHER CONTROLES
function preencherCampos(configuracoes) {
    campos.notificarRespostas.checked =
        configuracoes.notificarRespostas;

    campos.notificarEventos.checked =
        configuracoes.notificarEventos;

    campos.notificarComunidade.checked =
        configuracoes.notificarComunidade;

    campos.perfilPublico.checked =
        configuracoes.perfilPublico;

    campos.mostrarCidade.checked =
        configuracoes.mostrarCidade;

    campos.tema.value = configuracoes.tema;
    campos.fonte.value = configuracoes.fonte;
}

// LER VALORES ATUAIS
function lerCampos() {
    return {
        notificarRespostas:
            campos.notificarRespostas.checked,

        notificarEventos:
            campos.notificarEventos.checked,

        notificarComunidade:
            campos.notificarComunidade.checked,

        perfilPublico:
            campos.perfilPublico.checked,

        mostrarCidade:
            campos.mostrarCidade.checked,

        tema: campos.tema.value,
        fonte: campos.fonte.value
    };
}

// APLICAR APARÊNCIA
function aplicarAparencia(configuracoes) {
    document.body.classList.toggle(
        "tema-escuro",
        configuracoes.tema === "escuro"
    );

    document.body.classList.remove(
        "fonte-grande",
        "fonte-maior"
    );

    if (configuracoes.fonte === "grande") {
        document.body.classList.add("fonte-grande");
    }

    if (configuracoes.fonte === "maior") {
        document.body.classList.add("fonte-maior");
    }
}

// PRÉ-VISUALIZAÇÃO DA APARÊNCIA
campos.tema.addEventListener("change", function() {
    aplicarAparencia(lerCampos());
});

campos.fonte.addEventListener("change", function() {
    aplicarAparencia(lerCampos());
});

// SALVAR
formConfig.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const configuracoes = lerCampos();

    try {
        localStorage.setItem(
            CHAVE_CONFIG,
            JSON.stringify(configuracoes)
        );

        aplicarAparencia(configuracoes);

        mensagemConfig.textContent =
            "Preferências salvas neste navegador!";
    } catch (erro) {
        mensagemConfig.textContent =
            "Não foi possível salvar as preferências.";
    }
});

// RESTAURAR PADRÃO
document.querySelector("#restaurar-padrao")
    .addEventListener("click", function() {

        preencherCampos(configuracoesPadrao);
        aplicarAparencia(configuracoesPadrao);

        try {
            localStorage.removeItem(CHAVE_CONFIG);

            mensagemConfig.textContent =
                "Configurações padrão restauradas.";
        } catch (erro) {
            mensagemConfig.textContent =
                "Não foi possível atualizar o armazenamento.";
        }
    });

// INICIALIZAÇÃO
const configuracoesSalvas = carregarConfiguracoes();

preencherCampos(configuracoesSalvas);
aplicarAparencia(configuracoesSalvas);
