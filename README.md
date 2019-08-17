# Ethics Net beckend extension

### To get the app running

1 - Make sure to have `docker` and `docker-compose` installed

2 - Run `docker-compose up`

3 - The app will be running on `http://localhost:80`

### Stack used 

1 - Express

2 - Mongodb

3 - Docker & Docker-compose


#### App structure

App the files related to the app itself (Restful API and other stuff) are in the `./src` folder.

On the `./dist` folder are the compiled files ready for production that will be served by docker with nodemon. Planning on migrating it to `pm2` but for now it is in a simple version nodemon is enough.

