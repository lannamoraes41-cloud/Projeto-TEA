
// TEAJUDA - PAINEL ADMINISTRATIVO
// Protótipo Front-end
// Dados fictícios e temporários

const dadosAdmin = {
    usuarios: [
        {
            id: 1,
            nome: "Mariana Silva",
            informacao: "Membro da comunidade",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Carlos Oliveira",
            informacao: "Membro da comunidade",
            status: "Ativo"
        },
        {
            id: 3,
            nome: "Ana Souza",
            informacao: "Cadastro de exemplo",
            status: "Pendente"
        }
    ],

    publicacoes: [
        {
            id: 1,
            nome: "Experiências na escola",
            informacao: "Mariana Silva",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Rotina em família",
            informacao: "Carlos Oliveira",
            status: "Pendente"
        }
    ],

    duvidas: [
        {
            id: 1,
            nome: "Como organizar uma rotina visual?",
            informacao: "Categoria: Rotina",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Quais recursos ajudam na escola?",
            informacao: "Categoria: Educação",
            status: "Pendente"
        }
    ],

    eventos: [
        {
            id: 1,
            nome: "Autismo e inclusão escolar",
            informacao: "On-line",
            status: "Ativo"
        },
        {
            id: 2,
            nome: "Encontro de famílias",
            informacao: "Presencial",
            status: "Pendente"
        }
    ]
};

const corpoTabela =
    document.querySelector("#corpo-tabela-admin");

const campoPesquisa =
    document.querySelector("#pesquisa-admin");

const mensagemAdmin =
    document.querySelector("#mensagem-admin");

const abasAdmin =
    document.querySelectorAll(".aba-admin");

const painelConfirmacao =
    document.querySelector("#confirmacao-exclusao");

const textoConfirmacao =
    document.querySelector("#texto-confirmacao");

let tipoAtual = "usuarios";
let exclusaoPendente = null;

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

// ATUALIZAR INDICADORES
function atualizarIndicadores() {
    document.querySelector("#total-usuarios").textContent =
        dadosAdmin.usuarios.length;

    document.querySelector("#total-publicacoes").textContent =
        dadosAdmin.publicacoes.length;

    document.querySelector("#total-duvidas").textContent =
        dadosAdmin.duvidas.length;

    document.querySelector("#total-eventos-admin").textContent =
        dadosAdmin.eventos.length;
}

// EXIBIR REGISTROS
function mostrarRegistros() {
    const termo = campoPesquisa.value.trim().toLowerCase();

    const registros = dadosAdmin[tipoAtual].filter(
        function(registro) {
            return (
                registro.nome.toLowerCase().includes(termo) ||
                registro.informacao.toLowerCase().includes(termo) ||
                registro.status.toLowerCase().includes(termo)
            );
        }
    );

    corpoTabela.replaceChildren();

    if (registros.length === 0) {
        const linha = criarElemento("tr");
        const celula = criarElemento(
            "td", "",
            "Nenhum registro encontrado."
        );

        celula.colSpan = 4;
        linha.appendChild(celula);
        corpoTabela.appendChild(linha);
        return;
    }

    registros.forEach(function(registro) {
        const linha = criarElemento("tr");

        const colunaNome = criarElemento(
            "td", "", registro.nome
        );

        const colunaInformacao = criarElemento(
            "td", "", registro.informacao
        );

        const colunaStatus = criarElemento("td");

        const classeStatus =
            registro.status === "Ativo"
                ? "ativo"
                : registro.status === "Pendente"
                    ? "pendente"
                    : "oculto";

        colunaStatus.appendChild(
            criarElemento(
                "span",
                "status-admin " + classeStatus,
                registro.status
            )
        );

        const colunaAcoes = criarElemento("td");
        const grupoAcoes = criarElemento(
            "div", "acoes-registro"
        );

        const botaoStatus = criarElemento(
            "button",
            "btn-status",
            registro.status === "Ativo"
                ? "Ocultar"
                : "Ativar"
        );

        botaoStatus.type = "button";

        botaoStatus.addEventListener("click", function() {
            alterarStatus(registro.id);
        });

        const botaoExcluir = criarElemento(
            "button",
            "btn-excluir-admin",
            "Excluir"
        );

        botaoExcluir.type = "button";

        botaoExcluir.addEventListener("click", function() {
            solicitarExclusao(registro.id);
        });

        grupoAcoes.append(botaoStatus, botaoExcluir);
        colunaAcoes.appendChild(grupoAcoes);

        linha.append(
            colunaNome,
            colunaInformacao,
            colunaStatus,
            colunaAcoes
        );

        corpoTabela.appendChild(linha);
    });
}

// ALTERAR STATUS
function alterarStatus(id) {
    const registro = dadosAdmin[tipoAtual].find(
        function(item) {
            return item.id === id;
        }
    );

    if (!registro) {
        return;
    }

    registro.status =
        registro.status === "Ativo" ? "Oculto" : "Ativo";

    mensagemAdmin.textContent =
        "Status do registro atualizado nesta demonstração.";

    mostrarRegistros();
}

// SOLICITAR EXCLUSÃO
function solicitarExclusao(id) {
    const registro = dadosAdmin[tipoAtual].find(
        function(item) {
            return item.id === id;
        }
    );

    if (!registro) {
        return;
    }

    exclusaoPendente = {
        tipo: tipoAtual,
        id: id
    };

    textoConfirmacao.textContent =
        'Deseja excluir o registro "' +
        registro.nome +
        '" desta demonstração?';

    painelConfirmacao.hidden = false;

    painelConfirmacao.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// CONFIRMAR EXCLUSÃO
document.querySelector("#confirmar-exclusao")
    .addEventListener("click", function() {
        if (!exclusaoPendente) {
            return;
        }

        const lista = dadosAdmin[exclusaoPendente.tipo];

        const indice = lista.findIndex(function(item) {
            return item.id === exclusaoPendente.id;
        });

        if (indice !== -1) {
            lista.splice(indice, 1);
        }

        exclusaoPendente = null;
        painelConfirmacao.hidden = true;

        mensagemAdmin.textContent =
            "Registro excluído desta demonstração.";

        atualizarIndicadores();
        mostrarRegistros();
    });

// CANCELAR EXCLUSÃO
document.querySelector("#cancelar-exclusao")
    .addEventListener("click", function() {
        exclusaoPendente = null;
        painelConfirmacao.hidden = true;

        mensagemAdmin.textContent =
            "Exclusão cancelada.";
    });

// TROCAR ABAS
abasAdmin.forEach(function(botao) {
    botao.addEventListener("click", function() {
        tipoAtual = botao.dataset.tipo;

        abasAdmin.forEach(function(outroBotao) {
            const ativa = outroBotao === botao;

            outroBotao.classList.toggle("ativa", ativa);
            outroBotao.setAttribute(
                "aria-pressed", String(ativa)
            );
        });

        campoPesquisa.value = "";
        exclusaoPendente = null;
        painelConfirmacao.hidden = true;
        mensagemAdmin.textContent = "";

        mostrarRegistros();
    });
});

// PESQUISA
campoPesquisa.addEventListener("input", mostrarRegistros);

// INICIAR
atualizarIndicadores();
mostrarRegistros();
