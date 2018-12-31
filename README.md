# Battleship Game

## Building
To get set up, run the following commands and download a copy of the [GAE admin token](https://drive.google.com/file/d/1Fa89M5BX7gVD9jkjJv8TCsiFsLFyg_qJ/view?usp=sharing) to your project working directory:
```
.\setup
```
```
npm install
```
These commands will install the necessary Python and JavaScript dependencies for development and runtime of the application.

## Testing frontend
To just run the frontend of the game for testing, run the following command:
```
npm start
```
This will open a browser window at `localhost:8080`, this will render a local version of the game which will have no connection to a backend. This version supports hot reloading of front end files (auto refresh on file changes).

## Testing full server
To test the full server (frontend and backend), run the following commands:
```
npm run build
```
```
.\run
```