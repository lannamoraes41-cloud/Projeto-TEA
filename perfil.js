
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
function lerImagem(arquivo) {
    return new Promise(function(resolve, reject) {
        const leitor = new FileReader();

        leitor.onload = function() {
            resolve(leitor.result);
        };

        leitor.onerror = function() {
            reject(new Error("Não foi possível ler a imagem."));
        };

        leitor.readAsDataURL(arquivo);
    });
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

        try {
            novoPerfil.foto = await lerImagem(arquivo);
        } catch (erro) {
            mensagemPerfil.textContent =
                "Não foi possível carregar a foto.";
            return;
        }
    }

    try {
        localStorage.setItem(
            CHAVE_PERFIL,
            JSON.stringify(novoPerfil)
        );

        perfilSalvo = novoPerfil;

        atualizarCartao();
        preencherFormulario();

        mensagemPerfil.textContent =
            "Alterações salvas neste navegador com sucesso!";
    } catch (erro) {
        mensagemPerfil.textContent =
            "Não foi possível salvar os dados. " +
            "Tente usar uma foto menor.";
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
