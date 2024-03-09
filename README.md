# planner-plus-ui proxy server


## How to setup ths ui proxy?
1. Fork and clone the repo.
2. Create a .env file like below or use the .env.sample file as template.

```
PORT=8889
SSL_CERT_PATH=
SSL_CERT_KEY_PATH=
dev=dev.localhost
devui=devui.localhost
uat=uat.localhost
cicd=cicd.localhost

```

PORT: The port on which the server runs.
SSL_CERT_PATH: The path to the self signed ssl certificate .crt file. You can leave it blank to use the ssl certificate from the repo.
SSL_CERT_KEY_PATH: The path to the self signed ssl certificate .key file. You can leave it blank to use the ssl certificate from the repo.
dev,devui,uat,cicd: URLs to access the application on local using the respective env as proxy.

3. Run `yarn install` to install the dependencies.
4. Run `yarn proxy` to start the proxy server.

Using the .env like above, you should be able to access the local UI development enviromnent with proxied server at
`dev.localhost:8889` for dev env
`devui.localhost:8889` for devui env
`uat.localhost:8889` for uat env
`cicd.localhost:8889` for cicd env


## How can I add a new environment to the config? For example newenv.test.apps.ciena.com

1. Create an entry in .env file like:
```
...
newenv=newenv.localhost
```
2. Update conf.json with the remote URL for the new environment under `remotes` like:

```
{
	...
	"remotes": {
    	...
  		"newenv": "https://newenv.test.apps.ciena.com"
	}
}
```
Note: the key of the remote in `conf.json` should be same as the key in `.env` file.

3. Stop and restart the server.
4. You should be able to access the server now on the configured path: `newenv.localhost`


## How can i add a new page to proxy?

1. Edit `conf.json` file with `spa` and `port` values under the correct app.

The SPA name should match the name of the SPA or the route of the SPA.
The port should be same on which you local SPA build is running.


## After running the proxy, how can i access the SPA pages?
If you have configured everything properly and the proxy throws no errors in console, using the example above of .env file, you should be able to access the page (say planner-plus design-wizard page) on dev env at `http://dev.localhost:8889/planner-plus/design-wizard/`

