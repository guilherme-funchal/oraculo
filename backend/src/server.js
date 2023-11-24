
const routes = require('./routes');
const cors = require('cors');
const express = require('express');
var app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const hostname = process.env.REST_HOST || 'localhost';
const port = process.env.REST_PORT || 3002;

app.use(cors());
app.use(express.json())
app.use(routes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(port, hostname, () => {
  console.log(`Servidor rodando http://${hostname}:${port}/`);
});
