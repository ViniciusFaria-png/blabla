import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import fastify from "fastify";
import { env } from "./env";
import { postRoutes } from "./http/controller/post/routes";
import { userRoutes } from "./http/controller/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";

export const app = fastify({
  logger: true,
});

// Registrar JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Usar fake auth apenas em desenvolvimento e quando não for produção
if (env.ENV !== "production") {
  // Comentar ou remover esta linha quando quiser testar com JWT real
  // app.register(fakeAuth);
}

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Blog dinamico API",
      description: "API for Tech Challenge",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Local server",
      },
    ],
    tags: [
      { name: "Posts", description: "Operations related to posts" },
      { name: "Auth", description: "Authentication operations" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

app.register(userRoutes);
app.register(postRoutes);

app.setErrorHandler(globalErrorHandler);

app.ready((err) => {
  if (err) throw err;
  app.swagger();
  console.log(`Swagger docs available at http://localhost:${env.PORT}/docs`);
});
