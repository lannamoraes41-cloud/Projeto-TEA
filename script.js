
const formulario = document.querySelector("#form-login");

if (formulario) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        const email = document.querySelector("#email").value.trim();
        const senha = document.querySelector("#senha").value;
        const mensagem = document.querySelector("#mensagem-login");

        mensagem.style.color = "#d32f2f";

        if (!email || !senha) {
            mensagem.textContent = "Preencha todos os campos.";
            return;
        }

        mensagem.style.color = "#087bfa";
        mensagem.textContent = "Verificando seus dados...";

        try {
            const resposta = await fetch(
                "http://localhost:3000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.style.color = "#d32f2f";
                mensagem.textContent =
                    dados.mensagem || "Não foi possível entrar.";
                return;
            }

            mensagem.style.color = "#087bfa";
            mensagem.textContent = dados.mensagem;

            // Por enquanto, apenas confirma o login.
            // A sessão segura será implementada na próxima etapa.

        } catch (erro) {
            mensagem.style.color = "#d32f2f";
            mensagem.textContent =
                "Não foi possível conectar ao servidor TEAjuda.";
        }
    });
}



 // VALIDAÇÃO E CADASTRO NO MYSQL

const formCadastro = document.querySelector("#form-cadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", async function(evento) {

        evento.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email-cadastro").value.trim();
        const senha = document.querySelector("#senha-cadastro").value;
        const confirmar = document.querySelector("#confirmar-senha").value;

        const mensagem = document.querySelector("#mensagem-cadastro");

        mensagem.style.color = "#d32f2f";

        if (nome.length < 3) {
            mensagem.textContent = "Informe seu nome completo.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mensagem.textContent = "Informe um e-mail válido.";
            return;
        }

        if (senha.length < 8) {
            mensagem.textContent =
                "A senha precisa ter pelo menos 8 caracteres.";
            return;
        }

        if (senha !== confirmar) {
            mensagem.textContent = "As senhas não coincidem.";
            return;
        }

        mensagem.style.color = "#087bfa";
        mensagem.textContent = "Realizando seu cadastro...";

        try {
            const resposta = await fetch(
                "http://localhost:3000/api/cadastro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.style.color = "#d32f2f";
                mensagem.textContent = dados.mensagem;
                return;
            }

            mensagem.style.color = "#087bfa";
            mensagem.textContent = dados.mensagem;

            formCadastro.reset();

      } catch (erro) {
    console.error("Erro no cadastro TEAjuda:", erro);

    mensagem.style.color = "#d32f2f";
    mensagem.textContent =
        "Ocorreu um erro ao realizar o cadastro. Verifique o console.";
}
    });

}


// RECUPERAÇÃO DE SENHA

const formRecuperacao =
    document.querySelector("#form-recuperacao");

if (formRecuperacao) {

    formRecuperacao.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const email = document.querySelector(
            "#email-recuperacao"
        ).value.trim();

        const mensagem = document.querySelector(
            "#mensagem-recuperacao"
        );

        if (email === "") {
            mensagem.textContent =
                "Por favor, informe seu e-mail.";
            return;
        }

        mensagem.textContent =
            "E-mail validado! A recuperação de senha " +
            "estará disponível quando conectarmos " +
            "o sistema ao banco de dados.";

        mensagem.style.color = "#087bfa";

    });

}


