# SuperMash

Test project for technical interview at Cygni

### Prerequisites

node.js and npm

### Running server

Open a terminal and enter a folder you enjoy.

```
git clone https://github.com/golvmopp/cygni-test.git
cd cygni-test
npm install
node app.js
```

### Using the API

The server is now running locally on port 3000. Below is an example of how to use the site.

```
http://localhost:3000/artist/d6d6919a-0fbc-4440-bf1f-5e35d76c6a63
```

The above will output JSON data for Sturm und Drang.


### Problems

No error handling when the MBID is incorrect, could do 404 there.

Might need to enable CORS if to be used by other applications.

[SOLVED] Fetching images from is very slow, even though they have no restrictions.
