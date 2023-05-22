
require('dotenv').config({path: './.env'});

const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3000,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

// Modelo
class UsuarioModel {
  async findUsuarios() { return (await pool.query("SELECT * FROM usuarios;")).rows; }

  async findUsuarioById(id) { return (await pool.query("SELECT * FROM usuarios WHERE id = $1;", [id])).rows[0]; }

  async create(user) {
		await pool.query(
			`
				INSERT INTO usuarios (cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento)
				values ($1, $2, $3, $4, $5)
			`,
			[user.cedula_identidad, user.nombre, user.primer_apellido, user.segundo_apellido, user.fecha_nacimiento]
		);
  }

  async update(id, user) {
    await pool.query(
			`
				UPDATE usuarios
				SET cedula_identidad = $1, nombre = $2, primer_apellido = $3, segundo_apellido = $4, fecha_nacimiento = $5
				WHERE id = $6
			`,
			[user.cedula_identidad, user.nombre, user.primer_apellido, user.segundo_apellido, user.fecha_nacimiento, id]
		);
  }

  async delete(id) {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
  }

  async promedio() {
    const { rows } = await pool.query("SELECT AVG(EXTRACT(YEAR FROM AGE(NOW(),fecha_nacimiento))) AS promedio_edades FROM usuarios u;");
    return rows[0];
  }
}

//Controlador
class UsuarioController {
  constructor(model) {
    this.model = model;
  }

  async findUsuarios(req, res) {
    const data = await this.model.findUsuarios();
    res.send(data);
  }

  async findUsuarioById(req, res) {
    const id = req.params.id;
    const data = await this.model.findUsuarioById(id);
    res.send(data);
  }

  async create(req, res) {
		const User = {
			cedula_identidad: req.body.cedula_identidad,
			nombre: req.body.nombre,
			primer_apellido: req.body.primer_apellido,
			segundo_apellido: req.body.segundo_apellido,
			fecha_nacimiento: req.body.fecha_nacimiento,
		};
    await this.model.create(User);
    res.sendStatus(201);
  }

  async update(req, res) {
    const id = req.params.id;
		const User = {
			cedula_identidad: req.body.cedula_identidad,
			nombre: req.body.nombre,
			primer_apellido: req.body.primer_apellido,
			segundo_apellido: req.body.segundo_apellido,
			fecha_nacimiento: req.body.fecha_nacimiento,
		};
    await this.model.update(id, User);
    res.sendStatus(200);
  }

  async delete(req, res) {
    const id = req.params.id;
    await this.model.delete(id);
    res.sendStatus(200);
  }

  async promedio(req, res) {
    const data = await this.model.promedio();
    res.send(data);
  }

  async estado(req, res) {
    const data = {
      nameSystem: 'api-users',
      version: '0.0.1',
      developer: 'Rolando Cuevas Gutierrez',
      email: 'rolando.cuevasgutierrez@gmail.com',
    };
    res.send(data);
  }
}

//Instanciación
const usuarioModel = new UsuarioModel();
const usuarioController = new UsuarioController(usuarioModel);

app.use(express.json());

app.get("/usuarios", usuarioController.findUsuarios.bind(usuarioController));
app.get("/usuarios/promedio-edad", usuarioController.promedio.bind(usuarioController));
app.get("/usuarios/:id", usuarioController.findUsuarioById.bind(usuarioController));
app.post("/usuarios", usuarioController.create.bind(usuarioController));
app.put("/usuarios/:id", usuarioController.update.bind(usuarioController));
app.delete("/usuarios/:id", usuarioController.delete.bind(usuarioController));

app.get("/estado", usuarioController.estado.bind(usuarioController));


app.listen(process.env.APP_PORT, () => {
  console.log(`Este servidor se ejecuta en http://localhost:${process.env.APP_PORT}`);
});