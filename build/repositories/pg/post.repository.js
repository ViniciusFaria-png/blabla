"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/repositories/pg/post.repository.ts
var post_repository_exports = {};
__export(post_repository_exports, {
  PostRepository: () => PostRepository
});
module.exports = __toCommonJS(post_repository_exports);

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  POSTGRES_DB: import_zod.z.string(),
  POSTGRES_USER: import_zod.z.string(),
  POSTGRES_PASSWORD: import_zod.z.string(),
  POSTGRES_HOST: import_zod.z.string().default("db"),
  POSTGRES_PORT: import_zod.z.coerce.number()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/lib/db.ts
var import_pg = require("pg");
var CONFIG = {
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT
};
var Database = class {
  constructor() {
    this.pool = new import_pg.Pool(CONFIG);
    this.connection();
  }
  connection() {
    return __async(this, null, function* () {
      var _a;
      try {
        (_a = this.client) != null ? _a : this.client = yield this.pool.connect();
        console.log("Conex\xE3o com o banco de dados estabelecida com sucesso.");
      } catch (error) {
        console.error("Error ao conectar ao banco de dados:", error);
        throw error;
      }
    });
  }
  get clientInstance() {
    return this.client;
  }
  query(text, params) {
    return __async(this, null, function* () {
      if (!this.client) {
        yield this.connection();
      }
      if (!this.client) {
        throw new Error("Cliente do banco n\xE3o est\xE1 conectado.");
      }
      return this.client.query(text, params);
    });
  }
};
var db = new Database();

// src/repositories/pg/post.repository.ts
var PostRepository = class {
  create(data) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `INSERT INTO post (titulo, resumo, conteudo, professor_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, titulo, resumo, conteudo, professor_id, created_at, updated_at`,
        [data.titulo, data.resumo, data.conteudo, data.professor_id]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
  findAll() {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post`
      );
      return (result == null ? void 0 : result.rows) || [];
    });
  }
  findById(id) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post WHERE id = $1`,
        [id]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
  update(id, data) {
    return __async(this, null, function* () {
      var _a;
      const fields = [];
      const values = [];
      let paramIndex = 1;
      if (data.titulo !== void 0) {
        fields.push(`titulo = $${paramIndex++}`);
        values.push(data.titulo);
      }
      if (data.resumo !== void 0) {
        fields.push(`resumo = $${paramIndex++}`);
        values.push(data.resumo);
      }
      if (data.conteudo !== void 0) {
        fields.push(`conteudo = $${paramIndex++}`);
        values.push(data.conteudo);
      }
      if (data.professor_id !== void 0) {
        fields.push(`professor_id = $${paramIndex++}`);
        values.push(data.professor_id);
      }
      fields.push(`updated_at = NOW()`);
      values.push(id);
      if (fields.length === 0) {
        return this.findById(id);
      }
      const setClause = fields.join(", ");
      const query = `UPDATE post SET ${setClause} WHERE id = $${paramIndex} RETURNING id, titulo, resumo, conteudo, professor_id, created_at, updated_at`;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(query, values);
      return result == null ? void 0 : result.rows[0];
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      var _a;
      yield (_a = db.clientInstance) == null ? void 0 : _a.query(`DELETE FROM post WHERE id = $1`, [id]);
    });
  }
  searchQueryString(query) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT * FROM post WHERE titulo ILIKE $1 OR conteudo ILIKE $1`,
        [`%${query}%`]
      );
      return (result == null ? void 0 : result.rows) || [];
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostRepository
});
