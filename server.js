
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
// CONFIGURAÇÃO DA PASTA DE FOTOS
const pastaUploads = path.join(__dirname, "uploads");

// Criar a pasta caso ela não exista
if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

// CONFIGURAÇÃO DO MULTER
const armazenamento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pastaUploads);
    },

    filename: function (req, file, cb) {
        const nomeArquivo =
            Date.now() + "-" +
            Math.random().toString(36).substring(2, 10) +
            path.extname(file.originalname).toLowerCase();

        cb(null, nomeArquivo);
    }
});

const upload = multer({
    storage: armazenamento,
    limits: {
        fileSize: 1024 * 1024 // Máximo de 1 MB
    },
    fileFilter: function (req, file, cb) {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const extensoesPermitidas = [".jpg", ".jpeg", ".png", ".webp"];
        const extensao = path.extname(file.originalname).toLowerCase();
        console.log("Tipo da foto:", file.mimetype);
        console.log("Extensão da foto:", extensao);
        console.log("Nome original:", file.originalname);

        if (
            tiposPermitidos.includes(file.mimetype) &&
            extensoesPermitidas.includes(extensao)
        ) {
            cb(null, true);
        } else {
            cb(new Error("Formato de imagem não permitido."));
        }
    }
});
app.set("trust proxy", 1);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
        secure: process.env.NODE_ENV === "production",
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
            "SELECT id_usuario, nome, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ?",
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

       
req.session.regenerate((erroSessao) => {
    if (erroSessao) {
        console.error("Erro ao criar sessão:", erroSessao);

        return res.status(500).json({
            mensagem: "Não foi possível iniciar a sessão."
        });
    }

  req.session.usuario = {
    id: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario
};

    req.session.save((erroSalvar) => {
        if (erroSalvar) {
            console.error("Erro ao salvar sessão:", erroSalvar);

            return res.status(500).json({
                mensagem: "Não foi possível salvar a sessão."
            });
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: req.session.usuario
        });
    });
});


    } catch (erro) {
        console.error("Erro no login:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível realizar o login."
        });
    }
});
// CONSULTAR PERFIL DO USUÁRIO LOGADO
// VERIFICAR SE O USUÁRIO É ADMINISTRADOR
async function verificarAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: "Você precisa fazer login."
        });
    }

    try {
        const [usuarios] = await db.query(
            "SELECT tipo_usuario FROM usuarios WHERE id_usuario = ?",
            [req.session.usuario.id]
        );

        if (usuarios.length === 0) {
            return res.status(403).json({
                mensagem: "Acesso não autorizado."
            });
        }

        const tipo = usuarios[0].tipo_usuario;

        if (tipo !== "admin" && tipo !== "admin_principal") {
            return res.status(403).json({
                mensagem: "Acesso permitido somente para administradores."
            });
        }

        req.tipoAdmin = tipo;
        next();

    } catch (erro) {
        console.error("Erro ao verificar administrador:", erro);
        return res.status(500).json({
            mensagem: "Erro ao verificar permissões."
        });
    }
}
// TESTAR ACESSO ADMINISTRATIVO
app.get("/api/admin/verificar", verificarAdmin, (req, res) => {
    res.json({
        mensagem: "Acesso administrativo autorizado!",
        tipo_usuario: req.tipoAdmin
    });
});
app.get("/api/perfil", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const idUsuario = req.session.usuario.id;

        
       const [usuarios] = await db.query(
       
      `SELECT id_usuario, nome, email, telefone, cidade, sobre, foto_perfil, tipo_usuario
       FROM usuarios
       WHERE id_usuario = ?`,
       [idUsuario]
       );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        return res.json({
            usuario: usuarios[0]
        });

    } catch (erro) {
        console.error("Erro ao consultar perfil:", erro.message);

        return res.status(500).json({
            mensagem: "Não foi possível carregar o perfil."
        });
    }
});
// VERIFICAR USUÁRIO LOGADO
app.get("/api/usuario-logado", (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: "Você precisa fazer login."
        });
    }

    return res.json({
        usuario: req.session.usuario
    });
});
// ATUALIZAR PERFIL DO USUÁRIO LOGADO
app.put("/api/perfil", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const { nome, email, telefone, cidade, sobre } = req.body;

        if (
            typeof nome !== "string" ||
            nome.trim().length < 3 ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                mensagem: "Informe um nome e e-mail válidos."
            });
        }

        if (
            [telefone, cidade, sobre].some(
                valor => valor != null && typeof valor !== "string"
            )
        ) {
            return res.status(400).json({
                mensagem: "Dados do perfil inválidos."
            });
        }

        const idUsuario = req.session.usuario.id;

        await db.query(
            `UPDATE usuarios
             SET nome = ?, email = ?, telefone = ?, cidade = ?, sobre = ?
             WHERE id_usuario = ?`,
            [
                nome.trim(),
                email.trim().toLowerCase(),
                (telefone || "").trim(),
                (cidade || "").trim(),
                (sobre || "").trim(),
                idUsuario
            ]
        );

        req.session.usuario.nome = nome.trim();
        req.session.usuario.email = email.trim().toLowerCase();
        await new Promise((resolve, reject) => {
    req.session.save((erro) => {
        if (erro) {
            reject(erro);
        } else {
            resolve();
        }
    });
});

        return res.json({
            mensagem: "Perfil atualizado com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro.message);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        return res.status(500).json({
            mensagem: "Não foi possível atualizar o perfil."
        });
    }
});

const uploadFoto = upload.single("foto");


app.post("/api/perfil/foto", (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: "Você precisa fazer login."
        });
    }

    uploadFoto(req, res, async (erro) => {
        if (erro) {
            return res.status(400).json({
                mensagem: erro.code === "LIMIT_FILE_SIZE"
                    ? "A foto deve ter no máximo 1 MB."
                    : "Arquivo de imagem inválido."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                mensagem: "Selecione uma foto."
            });
        }

        let fotoCloudinary = null;

        try {
            // Enviar a imagem para o Cloudinary
            fotoCloudinary = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "teajuda/perfis",
                    resource_type: "image"
                }
            );

            // Guardar o endereço permanente no MySQL
            await db.query(
                `UPDATE usuarios
                 SET foto_perfil = ?
                 WHERE id_usuario = ?`,
                [
                    fotoCloudinary.secure_url,
                    req.session.usuario.id
                ]
            );

            return res.json({
                mensagem: "Foto atualizada com sucesso!",
                foto: fotoCloudinary.secure_url
            });

        } catch (erroFoto) {
            console.error("Erro ao salvar foto:", erroFoto.message);

            // Evitar imagem órfã se o banco falhar
            if (fotoCloudinary) {
                try {
                    await cloudinary.uploader.destroy(
                        fotoCloudinary.public_id
                    );
                } catch (erroLimpeza) {
                    console.error(
                        "Erro ao limpar foto:",
                        erroLimpeza.message
                    );
                }
            }

            return res.status(500).json({
                mensagem: "Não foi possível salvar a foto."
            });

        } finally {
            // Apagar o arquivo temporário do servidor
            fs.unlink(req.file.path, (erroLimpeza) => {
                if (erroLimpeza && erroLimpeza.code !== "ENOENT") {
                    console.error(
                        "Erro ao remover arquivo temporário:",
                        erroLimpeza.message
                    );
                }
            });
        }
    });
});


 // BUSCAR PUBLICAÇÕES DA COMUNIDADE NO MYSQL
app.get("/api/comunidade/publicacoes", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const [publicacoes] = await db.query(`
            SELECT
                p.id_publicacao AS id,
                p.conteudo AS texto,
                p.data_publicacao AS data,
                u.nome AS autor,
                COUNT(DISTINCT c.id_curtida) AS curtidas
            FROM publicacoes p
            JOIN usuarios u ON u.id_usuario = p.id_usuario
            LEFT JOIN curtidas c
                ON c.id_publicacao = p.id_publicacao
            GROUP BY
                p.id_publicacao,
                p.conteudo,
                p.data_publicacao,
                u.nome
            ORDER BY p.data_publicacao DESC
        `);

        return res.json({ publicacoes });

    } catch (erro) {
        console.error("Erro ao buscar publicações:", erro);

        return res.status(500).json({
            mensagem: "Erro ao carregar publicações."
        });
    }
});
 // SALVAR NOVA PUBLICAÇÃO NO MYSQL
app.post("/api/comunidade/publicacoes", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const texto = req.body.texto;

        if (typeof texto !== "string" || !texto.trim()) {
            return res.status(400).json({
                mensagem: "Escreva uma publicação."
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO publicacoes (id_usuario, conteudo)
             VALUES (?, ?)`,
            [req.session.usuario.id, texto.trim()]
        );

        return res.status(201).json({
            mensagem: "Publicação salva com sucesso!",
            id: resultado.insertId
        });

    } catch (erro) {
        console.error("Erro ao salvar publicação:", erro);
        return res.status(500).json({
            mensagem: "Não foi possível salvar a publicação."
        });
    }
});

// CURTIR OU RETIRAR CURTIDA DE UMA PUBLICAÇÃO
app.post("/api/comunidade/publicacoes/:id/curtir", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const idPublicacao = Number(req.params.id);
        const idUsuario = req.session.usuario.id;

        if (!Number.isInteger(idPublicacao) || idPublicacao <= 0) {
            return res.status(400).json({
                mensagem: "Publicação inválida."
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO curtidas (id_publicacao, id_usuario)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE id_curtida = id_curtida`,
            [idPublicacao, idUsuario]
        );

        let curtiu = true;

        if (resultado.affectedRows === 0) {
            await db.query(
                `DELETE FROM curtidas
                 WHERE id_publicacao = ? AND id_usuario = ?`,
                [idPublicacao, idUsuario]
            );

            curtiu = false;
        }

        const [contagem] = await db.query(
            `SELECT COUNT(*) AS total
             FROM curtidas
             WHERE id_publicacao = ?`,
            [idPublicacao]
        );

        return res.json({
            curtiu,
            curtidas: Number(contagem[0].total)
        });

    } catch (erro) {
        console.error("Erro ao salvar curtida:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível salvar a curtida."
        });
    }
});
// SALVAR COMENTÁRIO DE UMA PUBLICAÇÃO NO MYSQL
app.post("/api/comunidade/publicacoes/:id/comentarios", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const idPublicacao = Number(req.params.id);
        const idUsuario = req.session.usuario.id;
        const conteudo = req.body?.conteudo;

        if (!Number.isInteger(idPublicacao) || idPublicacao <= 0) {
            return res.status(400).json({
                mensagem: "Publicação inválida."
            });
        }

        if (typeof conteudo !== "string" || !conteudo.trim()) {
            return res.status(400).json({
                mensagem: "Escreva um comentário."
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO comentarios (id_publicacao, id_usuario, conteudo)
             VALUES (?, ?, ?)`,
            [idPublicacao, idUsuario, conteudo.trim()]
        );

        return res.status(201).json({
            mensagem: "Comentário salvo com sucesso!",
            id: resultado.insertId
        });

    } catch (erro) {
        console.error("Erro ao salvar comentário:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível salvar o comentário."
        });
    }
});
// BUSCAR COMENTÁRIOS SALVOS NO MYSQL
app.get("/api/comunidade/comentarios", async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({
                mensagem: "Você precisa fazer login."
            });
        }

        const [comentarios] = await db.query(`
            SELECT
                c.id_comentario AS id,
                c.id_publicacao,
                c.conteudo AS texto,
                c.data_comentario AS data,
                u.nome AS autor
            FROM comentarios c
            JOIN usuarios u ON u.id_usuario = c.id_usuario
            ORDER BY c.data_comentario ASC, c.id_comentario ASC
        `);

        return res.json({ comentarios });

    } catch (erro) {
        console.error("Erro ao buscar comentários:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível carregar os comentários."
        });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor TEAjuda rodando na porta ${PORT}`);
});