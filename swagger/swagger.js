import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Visit Ethiopia API',
      version: '1.0.0',
      description: 'API documentation for the Visit Ethiopia project',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local server',
      },
    ],
  },
  apis: ['./swagger/*.docs.js'], // Where to find JSDoc comments
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
