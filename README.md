# EthicsNet backend extension

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


### Authentication secret configuration

`JWT_SECRET` is required by every process that issues or verifies login tokens.
Supply at least 32 bytes of randomly generated secret material through the runtime
environment. There is no source-code fallback, including in test mode.

On macOS, keep the value in Keychain and inject it only when starting the process:

```sh
JWT_SECRET="$(security find-generic-password -s ethicsnet-backend -a jwt-secret -w)" docker-compose up
```

Provision the Keychain entry using a secure credential-management workflow. Do not
store the value in `src/globals.js`, a dotfile, shell history, or the repository.
For hosted deployments, use the provider's secret store and coordinate the same
new value across all application instances. Replacing the exposed signing secret
invalidates old login tokens and requires users to sign in again.

The removed SMTP/database literals remain exposed in Git history. Their account
owners must revoke or rotate them separately. Source removal is not revocation.
