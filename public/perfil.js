
// TEAJUDA - MEU PERFIL
// Protótipo Front-end com localStorage

const CHAVE_PERFIL = "teajuda_perfil_demo";

const formPerfil = document.querySelector("#form-perfil");
const nomePerfil = document.querySelector("#nome-perfil");
const emailPerfil = document.querySelector("#email-perfil");
const telefonePerfil = document.querySelector("#telefone-perfil");
const cidadePerfil = document.querySelector("#cidade-perfil");
const sobrePerfil = document.querySelector("#sobre-perfil");
const fotoArquivo = document.querySelector("#foto-arquivo");

const nomeExibicao = document.querySelector("#nome-exibicao");
const emailExibicao = document.querySelector("#email-exibicao");
const imagemPerfil = document.querySelector("#imagem-perfil");
const avatarPadrao = document.querySelector("#avatar-padrao");
const mensagemPerfil = document.querySelector("#mensagem-perfil");

const botaoCancelar =
    document.querySelector("#cancelar-edicao");

const perfilPadrao = {
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    sobre: "",
    foto: ""
};

let perfilSalvo = carregarPerfil();

function carregarPerfil() {
    try {
        const dados = localStorage.getItem(CHAVE_PERFIL);

        if (!dados) {
            return { ...perfilPadrao };
        }

        return {
            ...perfilPadrao,
            ...JSON.parse(dados)
        };
    } catch (erro) {
        return { ...perfilPadrao };
    }
}

// PREENCHER CAMPOS
function preencherFormulario() {
    nomePerfil.value = perfilSalvo.nome;
    emailPerfil.value = perfilSalvo.email;
    telefonePerfil.value = perfilSalvo.telefone;
    cidadePerfil.value = perfilSalvo.cidade;
    sobrePerfil.value = perfilSalvo.sobre;
    fotoArquivo.value = "";
}

// ATUALIZAR CARTÃO
function atualizarCartao() {
    nomeExibicao.textContent =
        perfilSalvo.nome || "Usuário(a) TEAjuda";

    emailExibicao.textContent =
        perfilSalvo.email || "E-mail não informado";

    if (perfilSalvo.foto) {
        imagemPerfil.src = perfilSalvo.foto;
        imagemPerfil.hidden = false;
        avatarPadrao.hidden = true;
    } else {
        imagemPerfil.removeAttribute("src");
        imagemPerfil.hidden = true;
        avatarPadrao.hidden = false;
    }
}

// CONVERTER FOTO PARA VISUALIZAÇÃO

async function enviarFotoParaServidor(arquivo) {
    const formulario = new FormData();
    formulario.append("foto", arquivo);

    const resposta = await fetch("/api/perfil/foto", {
        method: "POST",
        credentials: "same-origin",
        body: formulario
    });

    const dados = await resposta.json();

    if (resposta.status === 401) {
        window.location.href = "login.html";
        throw new Error("Sessão expirada.");
    }

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao enviar foto.");
    }

    return dados.foto;
}

// SALVAR ALTERAÇÕES
formPerfil.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const nome = nomePerfil.value.trim();
    const email = emailPerfil.value.trim();

    if (nome.length < 3) {
        mensagemPerfil.textContent =
            "Informe um nome com pelo menos 3 caracteres.";
        return;
    }

    if (!emailPerfil.checkValidity()) {
        mensagemPerfil.textContent =
            "Informe um e-mail válido.";
        return;
    }

    const novoPerfil = {
        nome: nome,
        email: email,
        telefone: telefonePerfil.value.trim(),
        cidade: cidadePerfil.value.trim(),
        sobre: sobrePerfil.value.trim(),
        foto: perfilSalvo.foto
    };

    const arquivo = fotoArquivo.files[0];

    if (arquivo) {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            mensagemPerfil.textContent =
                "Escolha uma imagem JPG, PNG ou WebP.";
            return;
        }

        if (arquivo.size > 1024 * 1024) {
            mensagemPerfil.textContent =
                "A imagem deve ter no máximo 1 MB.";
            return;
        }

    }


try {
    const resposta = await fetch("/api/perfil", {
        method: "PUT",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: novoPerfil.nome,
            email: novoPerfil.email,
            telefone: novoPerfil.telefone,
            cidade: novoPerfil.cidade,
            sobre: novoPerfil.sobre
        })
    });

    const dados = await resposta.json();

    if (resposta.status === 401) {
        window.location.href = "login.html";
        return;
    }

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || "Não foi possível atualizar o perfil."
        );
    }
     if (arquivo) {
    novoPerfil.foto = await enviarFotoParaServidor(arquivo);
}

    perfilSalvo = novoPerfil;

    atualizarCartao();
    preencherFormulario();

    mensagemPerfil.textContent =
        "Perfil atualizado no MySQL com sucesso!";

} catch (erro) {
    console.error("Erro ao salvar perfil:", erro);
    console.error("Nome do erro:", erro.name);
    console.error("Detalhes:", erro.stack);

    mensagemPerfil.textContent =
        "Não foi possível salvar o perfil. Verifique o console.";
}

});

// CANCELAR EDIÇÃO
botaoCancelar.addEventListener("click", function() {
    preencherFormulario();

    mensagemPerfil.textContent =
        "Alterações não salvas foram descartadas.";
});

// INICIAR PÁGINA
preencherFormulario();
atualizarCartao();
// CARREGAR DADOS DO USUÁRIO LOGADO NO MYSQL
async function carregarDadosDoBanco() {
    try {
        const resposta = await fetch("/api/perfil", {
            credentials: "same-origin"
        });

        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o perfil.");
        }

        const dados = await resposta.json();
        const usuario = dados.usuario;

        perfilSalvo = {
    ...perfilSalvo,
    nome: usuario.nome || "",
    email: usuario.email || "",
    telefone: usuario.telefone || "",
    cidade: usuario.cidade || "",
    sobre: usuario.sobre || "",
    foto: usuario.foto_perfil || ""
    };

        preencherFormulario();
        atualizarCartao();

    } catch (erro) {
        mensagemPerfil.textContent =
            "Erro ao carregar os dados do perfil.";
        console.error(erro);
    }
}

carregarDadosDoBanco();
