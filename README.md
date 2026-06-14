Tacoteca
Sistema de comercio electrónico para la gestión de pedidos y venta de alimentos, especializado en tacos de carne asada, barbacoa y especialidades gratinadas como chiletecas y tostatecas. El proyecto cuenta con una arquitectura desacoplada compuesta por una interfaz de usuario en el frontend y una interfaz de programación de aplicaciones en el backend.

Requisitos Previos
Antes de iniciar con la instalación, asegúrese de tener instalado el siguiente software en su equipo:

Node.js (versión 16.0.0 o superior)

npm (administrador de paquetes de Node)

MongoDB (instancia local corriendo en el puerto 27017 o una cuenta en MongoDB Atlas)

Estructura del Proyecto
El repositorio está dividido en dos directorios principales:

backend/: Servidor de la aplicación desarrollado con Express y Node.js.

frontend/: Interfaz de usuario desarrollada con React, Vite y Tailwind CSS.

Instrucciones de Instalación y Configuración
Siga los pasos a continuación para desplegar el proyecto en su entorno local de desarrollo.

1. Clonar el repositorio
Abra su terminal y ejecute el siguiente comando para clonar el proyecto:
git clone https://github.com/tu-usuario/tacoteca.git
cd tacoteca

2. Configuración del Backend
Muévase al directorio del backend para instalar las dependencias y configurar las variables de entorno:
cd backend
npm install

Cree un archivo llamado .env en la raíz de la carpeta backend basándose en el archivo .env.example y defina las siguientes variables obligatorias:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tacoteca_db
JWT_SECRET=su_clave_secreta_aqui

3. Configuración del Frontend
Abra una nueva terminal, diríjase a la carpeta del frontend e instale los paquetes necesarios:
cd frontend
npm install

Cree un archivo llamado .env en la raíz de la carpeta frontend para apuntar al servidor del backend:
VITE_API_URL=http://localhost:5000/api

Ejecución del Proyecto
Para levantar la aplicación por completo, debe iniciar ambos servidores simultáneamente en terminales separadas.

Iniciar el Backend
Dentro de la carpeta backend, ejecute el script de desarrollo:
npm start
El servidor de Express se iniciará por defecto en el puerto 5000.

Iniciar el Frontend
Dentro de la carpeta frontend, ejecute el comando de Vite:
npm run dev
La aplicación web estará disponible en su navegador a través de la dirección local http://localhost:5173.

Visualización en Dispositivos Móviles
Si desea auditar o visualizar el comportamiento responsivo del proyecto desde un teléfono celular en la misma red local, ejecute el frontend exponiendo el host:
npm run dev -- --host

Asegúrese de modificar la dirección VITE_API_URL en el archivo del frontend reemplazando localhost por la dirección IP privada asignada a su computadora por la red local.