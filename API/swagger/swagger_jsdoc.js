const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Besafe API', // Title (required)
            version: '1.0', // Version (required)
        },
    },
    // Path to the API docs
    apis: [
        './controller/*',
        './middleware/*',
        './model/*',
        './routes/*',
    ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync('./swagger/specs.json', JSON.stringify(swaggerSpec));