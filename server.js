
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.static(__dirname));

const db = require("./db");
const bcrypt = require("bcrypt");
const session = require("express-session");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    }
}));

app.get("/teste-banco", async (req, res) => {
    try {
        const [resultado] = await db.query("SELECT DATABASE() AS banco");

        res.json({
            mensagem: "Conexão com MySQL realizada com sucesso!",
            banco: resultado[0].banco
        });
    } catch (erro) {
        console.error("Erro ao conectar ao MySQL:", erro.message);

        res.status(500).json({
            mensagem: "Não foi possível conectar ao banco de dados."
        });
    }
});
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Servidor TEAjuda funcionando!");
});
const PORT = process.env.PORT || 3000;
app.post("/api/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (
            typeof nome !== "string" ||
            typeof email !== "string" ||
            typeof senha !== "string" ||
            nome.trim().length < 3 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            senha.length < 8
        ) {
            return res.status(400).json({
                mensagem: "Confira os dados do cadastro."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const [usuarios] = await db.query(
            "SELECT id_usuario FROM usuarios WHERE email = ?",
            [emailNormalizado]
        );

        if (usuarios.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        await db.query(
            `INSERT INTO usuarios (nome, email, senha_hash)
             VALUES (?, ?, ?)`,
            [nome.trim(), emailNormalizado, senhaHash]
        );

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso!"
        });

    } catch (erro) {
        console.error("Erro no cadastro:", erro.message);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        return res.status(500).json({
            mensagem: "Não foi possível realizar o cadastro."
        });
    }
});




app.post("/api/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (
            typeof email !== "string" ||
            typeof senha !== "string" ||
            !email.trim() ||
            !senha
        ) {
            return res.status(400).json({
                mensagem: "Informe seu e-mail e senha."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const [usuarios] = await db.query(
            "SELECT id_usuario, nome, email, senha_hash FROM usuarios WHERE email = ?",
            [emailNormalizado]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        const usuario = usuarios[0];
        console.log("Usuário encontrado:", usuario.email);
        console.log("Hash encontrado:", Boolean(usuario.senha_hash));

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (erro) {
        console.error("Erro no login:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível realizar o login."
        });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor TEAjuda rodando na porta ${PORT}`);
});