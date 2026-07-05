require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "acme-secreto-2026";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>ACME ERP</title>
      <style>
        body { font-family: Arial; margin: 40px; background: #f4f4f4; }
        .card { background: white; padding: 25px; border-radius: 10px; width: 430px; }
        input, button { width: 100%; padding: 10px; margin-top: 10px; }
        button { background: #0d6efd; color: white; border: none; cursor: pointer; }
        pre { background: #eee; padding: 10px; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>ACME ERP</h1>
        <p>Portal con autenticación y acceso condicional mediante token JWT.</p>

        <input id="usuario" value="admin">
        <input id="password" value="123456" type="password">
        <button onclick="login()">Iniciar sesión</button>
        <button onclick="privado()">Probar acceso privado</button>

        <h3>Resultado:</h3>
        <pre id="resultado"></pre>
      </div>

      <script>
        let token = "";

        async function login() {
          const usuario = document.getElementById("usuario").value;
          const password = document.getElementById("password").value;

          const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, password })
          });

          const data = await res.json();
          token = data.token || "";
          document.getElementById("resultado").innerText = JSON.stringify(data, null, 2);
        }

        async function privado() {
          const res = await fetch("/privado", {
            headers: { "Authorization": "Bearer " + token }
          });

          const text = await res.text();
          document.getElementById("resultado").innerText = text;
        }
      </script>
    </body>
    </html>
  `);
});

app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      mensaje: "Conexión correcta a PostgreSQL",
      fecha: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error conectando a PostgreSQL",
      error: error.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario=$1 AND password=$2",
      [usuario, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ usuario }, SECRET, { expiresIn: "1h" });

    res.json({
      mensaje: "Login correcto",
      token
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno",
      error: error.message
    });
  }
});

app.get("/privado", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send("Acceso denegado: falta token");
  }

  const token = auth.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, SECRET);
    res.send("Acceso autorizado al recurso privado del ERP ACME para el usuario: " + decoded.usuario);
  } catch {
    res.status(401).send("Token inválido o expirado");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor iniciado en puerto " + PORT);
});
