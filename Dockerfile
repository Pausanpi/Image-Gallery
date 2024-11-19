# Usa una imagen base con un servidor web ligero
FROM node:14-alpine

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Instala http-server, un servidor web estático
RUN npm install -g http-server

# Expone el puerto 3000 para acceder a la aplicación
EXPOSE 3000

# Comando por defecto para ejecutar el servidor
CMD ["http-server", "-p", "3000"]
