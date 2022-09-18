const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const routesFiles = ['./api/routes/defaultRoute.js', './api/routes/alunoRoute.js']

swaggerAutogen(outputFile, routesFiles);