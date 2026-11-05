
const formulario = document.querySelector("#form-login");

if (formulario) {

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const email = document.querySelector("#email").value;
        const senha = document.querySelector("#senha").value;
        const mensagem = document.querySelector("#mensagem-login");

        if (email.trim() === "" || senha.trim() === "") {
            mensagem.textContent = "Preencha todos os campos.";
            return;
        }

        mensagem.textContent =
            "O login estará disponível após a conexão com o banco de dados.";

    });

}

// VALIDAÇÃO DO CADASTRO

const formCadastro = document.querySelector("#form-cadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email-cadastro").value.trim();
        const senha = document.querySelector("#senha-cadastro").value;
        const confirmar = document.querySelector("#confirmar-senha").value;

        const mensagem = document.querySelector("#mensagem-cadastro");

        if (nome.length < 3) {
            mensagem.textContent = "Informe seu nome completo.";
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
        mensagem.textContent =
            "Dados validados! O cadastro será ativado quando conectarmos o banco de dados.";

    });

}

// VALIDAÇÃO DO CADASTRO

const formCadastro = document.querySelector("#form-cadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const email = document.querySelector("#email-cadastro").value.trim();
        const senha = document.querySelector("#senha-cadastro").value;
        const confirmar = document.querySelector("#confirmar-senha").value;

        const mensagem = document.querySelector("#mensagem-cadastro");

        if (nome.length < 3) {
            mensagem.textContent = "Informe seu nome completo.";
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
        mensagem.textContent =
            "Dados validados! O cadastro será ativado quando conectarmos o banco de dados.";

    });

}

