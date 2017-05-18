# Accredible :: Fullstack assessment

This starter repo uses node / npm and has the following features to help you get started:

 * An express server
   * Runs on localhost:3000
   * Serves the `/public` directory as static files
   * Simple route logic on `/get-url` to read URLs
 * Uses `phantomjs` (via the `horseman` wrapper) to read URLs
   * You can process the response however you see fit

It does not have any FE frameworks (Angular, jQuery) just a simple hello world `index.html` file.

## Getting started

Assuming you have node / npm available, install the dependencies, then run the server:
```
npm install
node server.js
```

## Feeling lazy?

Use `nodemon` to watch for changes in your files and automatically restart the express server (or use pm2)

```
npm install -g nodemon
nodemon server.js
```

## Need to debug horseman?

Use one of these to include console logging in your horseman threads

```
DEBUG=horseman node server.js
DEBUG=horseman nodemon server.js
```

## Usage
Visit http://localhost:3000/ for instructions.

http://localhost:3000/get-url?url=http://accredible.com/ will return a JSON object with a key `html` which contains the response HTML from the URL supplied as a parameter.
