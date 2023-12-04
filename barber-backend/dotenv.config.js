const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env'); // Ajusta la ruta a la carpeta capstone

dotenv.config({ path: envPath });