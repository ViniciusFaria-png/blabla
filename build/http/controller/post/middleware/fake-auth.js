"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/http/controller/post/middleware/fake-auth.ts
var fake_auth_exports = {};
__export(fake_auth_exports, {
  fakeAuth: () => fakeAuth
});
module.exports = __toCommonJS(fake_auth_exports);

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

// src/http/controller/post/middleware/fake-auth.ts
var import_fastify_plugin = __toESM(require("fastify-plugin"));
var fakeAuth = (0, import_fastify_plugin.default)(
  function fakeAuth2(fastify) {
    return __async(this, null, function* () {
      var _a;
      const { rows } = yield db.query("SELECT id FROM professor LIMIT 1");
      const professorId = ((_a = rows[0]) == null ? void 0 : _a.id) || 1;
      fastify.decorateRequest("user", void 0);
      fastify.addHook("preHandler", (req) => __async(null, null, function* () {
        req.user = {
          id: "fake-user-id",
          professor_id: professorId.toString(),
          email: "test@example.com"
        };
      }));
    });
  },
  { name: "fakeAuth" }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fakeAuth
});
