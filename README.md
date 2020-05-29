# TicTacToe Backend

API que simula el comportamiento de una IA jugando al tres en raya o Tic Tac Toe. 
El bot comprueba si puede ganar la partida, si la puede perder o, en caso contrario, moverá la siguiente posición libre del tablero. En caso de comprobar una victoria o una derrota, indicará las posiciones que han resultado ganadoras.

## Características y dependencias

* Uso de `Node JS` y el framework `express` para crear el servidor.
* Validación de datos enviados a los endpoints usando `express-validator`.
* Documentación dinámica del API utilizando `swagger-ui-express`.
* Gestión de variables de entorno con `dotenv`.

A nivel de desarrollo también se hace uso de las dependencias necesarias para los tests y para ejecutar el backend modo *hot reloading*:

* mocha
* supertest
* nodemon

## Configuración del proyecto

Clonar este repo en tu equipo, accede a la raíz del proyecto e instala las dependencias con npm:
```
$ git clone 'url'
$ cd tic-tac-toe-backend
$ npm install
```

## Configuración de las variables de entorno

Crea un archivo `.env` (utiliza `.env.example` como guía) donde almacenarás todas las variables de entorno necesarias. Te tiene que quedar un archivo similar a esto:

```
PORT=puerto deseado
BOARD_SIZE=tamaño del tablero (normalmente 3)
KEY_FILE_PATH=./certs/key_file.pem
CERT_FILE_PATH=./certs/cert_file.pem
```

## Ejecutando el servidor
Una vez que el proyecto está configurado, deberías poder arrancar el proyecto en modo desarrollo o modo normal. 

### Ejecutando en modo desarrollador
```
$ npm run dev
```
### Ejecutando en modo 'normal'
```
$ npm start
```

Este comando ejecutará la aplicación de express y la ejecutará en el puerto que hayas indicado en el archivo `.env` o, de no ser así, en el `3000`.

## Tests unitarios
Se han añadido varios tests unitarios para probar distintos endpoints del API.

Para lanzar los tests utiliza el comando:

```
$ npm run test
```

## Ejemplos de peticiones al API
Con el servidor arrancado y utilizando Postman para probar el API, tenemos las siguientes posibles peticiones:

### Movimiento para ganar la partida
```
POST https://localhost:3001/api/plays

// En el body añadimos el tablero y con qué jugará el bot (X ó O):
{
    "board": ["X", "", "O", "O", "X", "O", "", "X", ""],
    "isBotX": true
}
```
El bot debería de marcar la última casilla para ganar la partida.

### Movimiento para evitar perder la partida
```
POST https://localhost:3001/api/plays

// En el body añadimos el tablero y con qué jugará el bot (X ó O):
{
    "board": ["X", "X", "", "", "O", "", "", "", ""],
    "isBotX": false
}
```
El bot debería de marcar la tercera casilla para evitar perder la partida.

## Documentación del API
Si quieres ver más documentación o probar directamente el API, arranca el servidor en modo normal o desarrollo y accede a la URL `https://localhost:3001/api/doc` (el puerto será el que hayas indicado en .env o 3000 por defecto)


Se te mostrará una página con Swagger para que puedas probar directamente el API.

## Dudas o preguntas
Si tienes alguna duda o pregunta sobre el API puedes contactar conmigo a través de mis redes sociales:
```
LinkedIn: https://linkedin.com/in/davidescribanorodriguez
GitHub: https://github.com/lb12
```