# Utiliza una imagen base de Node.js
FROM node:19

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Compila la aplicación
RUN npm run build

# Expone el puerto en el que la aplicación escucha
EXPOSE 4000

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
