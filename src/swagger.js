// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TO-DO API",
      version: "1.0.0",
      description: "A TO-DO API built with Express and Sequelize",
    },
    components: {
      securitySchemes: {
        AuthorizationHeader: {
          type: "apiKey",
          in: "header",
          name: "authentication",
        },
      },
    },
    security: [
      {
        AuthorizationHeader: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
