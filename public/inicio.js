// TEAjuda - Mostrar usuário logado no topo

async function carregarUsuarioTopo() {
    try {
        const resposta = await fetch("/api/perfil", {
            credentials: "same-origin"
        });

        if (!resposta.ok) {
            console.error("Não foi possível carregar o perfil.");
            return;
        }

        const dados = await resposta.json();
        const usuario = dados.usuario;

        // Mostrar nome do usuário
        const nome = document.querySelector("#nome-usuario");

        if (nome) {
            nome.textContent = usuario.nome || "Usuário(a)";
        }

        // Mostrar foto do usuário
        const foto = document.querySelector("#foto-usuario-topo");
        const icone = document.querySelector("#icone-usuario-topo");

        if (foto && icone && usuario.foto_perfil) {
            foto.src = usuario.foto_perfil;
            foto.style.display = "block";
            icone.style.display = "none";
        }

    } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
    }
}

carregarUsuarioTopo();