import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fakeAuth } from "__tests__/utils/fake-auth";
import fastify from "fastify";
import { env } from "./env";
import { postRoutes } from "./http/controller/post/routes";
import { userRoutes } from "./http/controller/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";

export const app = fastify({
  logger: true,
});

if (env.ENV !== "production") {
  app.register(fakeAuth);
}
// app.register(fastifyJwt, {
//   secret: env.JWT_SECRET, // coloque isso no seu .env e no env.ts
// });

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
    tags: [{ name: "Posts", description: "Operations related to posts" }],
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
