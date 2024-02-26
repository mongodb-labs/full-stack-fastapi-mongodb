# Development and cookiecutter installation

This section will walk through setting up your local environment for developing a generated app. **It is highly advised you read through the input variables before running the cookiecutter command**

1. [Building a generated app](getting-started.md)
2. [Deployment for production](deployment-guide.md)
3. [Authentication and magic tokens](authentication-guide.md)
4. [Websockets for interactive communication](websocket-guide.md)

---

## Contents

- [Generate passwords](#generate-passwords)
- [Understanding input variables](#input-variables)
- [Run Cookiecutter](#run-cookiecutter)
- [Local development](#local-development)
- [Starting JupyterLab](#starting-jupyterlab)

## Generate passwords

You will be asked to provide passwords and secret keys for several components. Open another terminal and run:

```bash
openssl rand -hex 32
# Outputs something like: 99d3b1f01aa639e4a76f4fc281fc834747a543720ba4c8a8648ba755aef9be7f
```

Copy the contents and use that as password / secret key. And run that again to generate another secure key.

## Input variables

The generator (Cookiecutter) will ask you for data on a long list of fields which will be used to populate variables across the project, customizing it for you out of the box. **You might want to have these on hand before generating the project.** 

Take note, some of these inputs are production deployment specific, so you can opt to replace them later (their environment variable assignments will be located at the top level `.env` file in the generated app directory) or rewrite them in the provided `cookiecutter-config-file.yml` and [rerun cookiecutter supplying the file reference as a parameter in the new call](../{{cookiecutter.project_slug}}/README.md). 

The input variables, with their default values (some auto generated) are:

- `project_name`: The name of the project. This will also be the folder in which your project is generated.
- `project_slug`: The development friendly name of the project. By default, based on the project name
- `domain_main`: The domain in where to deploy the project for production (from the branch `production`), used by the load balancer, backend, etc. By default, based on the project slug.
- `domain_staging`: The domain in where to deploy while staging (before production) (from the branch `master`). By default, based on the main domain.
- `domain_base_api_url`: The domain url used by the frontend app for backend api calls. If deploying a localhost development environment, likely to be `http://localhost/api/v1`
- `domain_base_ws_url`: The domain url used by the frontend app for backend websocket calls. If deploying a localhost development environment, likely to be `ws://localhost/api/v1`
- `docker_swarm_stack_name_main`: The name of the stack while deploying to Docker in Swarm mode for production. By default, based on the domain.
- `docker_swarm_stack_name_staging`: The name of the stack while deploying to Docker in Swarm mode for staging. By default, based on the domain.
- `secret_key`: Backend server secret key. Use the method above to generate it.
- `totp_secret_key`: Time-based One Time Password secret key. Use the method above to generate it.
- `first_superuser`: The first superuser generated, with it you will be able to create more users, etc. By default, based on the domain.
- `first_superuser_password`: First superuser password. Use the method above to generate it.
- `backend_cors_origins`: Origins (domains, more or less) that are enabled for CORS ([Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)). This informs a frontend browser in one domain (e.g. `https://dashboard.example.com`) it can trust this backend, that could be living in another domain (e.g. `https://api.example.com`). It can also be used to allow your local frontend (with a custom `hosts` domain mapping, as described in the project's `README.md`) that could be living in `http://dev.example.com:8080` to communicate with the backend at `https://stag.example.com`. Notice the `http` vs `https` and the `dev.` prefix for local development vs the "staging" `stag.` prefix. By default, it includes origins for production, staging and development, with ports commonly used during local development by several popular frontend frameworks (Vue with `:8080`, React, Angular).
- `smtp_port`: Port to use to send emails via SMTP. By default `587`.
- `smtp_host`: Host to use to send emails, it would be given by your email provider, like Mailgun, Sparkpost, etc.
- `smtp_user`: The user to use in the SMTP connection. The value will be given by your email provider.
- `smtp_password`: The password to be used in the SMTP connection. The value will be given by the email provider.
- `smtp_emails_from_email`: The email account to use as the sender in the notification emails, it could be something like `info@your-custom-domain.com`.
- `smtp_emails_from_name`: The email account name to use as the sender in the notification emails, it could be something like `Symona Adaro`.
- `smtp_emails_to_email`: The email account to use as the recipient for `contact us` emails, it could be something like `requests@your-custom-domain.com`.
- `smtp_tls`: Enable TLS with SMTP. Defaults to true 
- `mongodb_uri`: MongoDB URI for access to the cluster
- `mongodb_database`: MongoDB database to have the application operate within
- `traefik_constraint_tag`: The tag to be used by the internal Traefik load balancer (for example, to divide requests between backend and frontend) for production. Used to separate this stack from any other stack you might have. This should identify each stack in each environment (production, staging, etc).
- `traefik_constraint_tag_staging`: The Traefik tag to be used while on staging.
- `traefik_public_constraint_tag`: The tag that should be used by stack services that should communicate with the public.
- `flower_auth`: Basic HTTP authentication for flower, in the form`user:password`. By default: "`admin:changethis`".
- `sentry_dsn`: Key URL (DSN) of Sentry, for live error reporting. You can use the open source version or a free account. E.g.: `https://1234abcd:5678ef@sentry.example.com/30`.
- `docker_image_prefix`: Prefix to use for Docker image names. If you are using A non-DockerHub registry it would be based on your code repository. E.g.: `quay.io/development-team/my-awesome-project/`.
- `docker_image_backend`: Docker image name for the backend. By default, it will be based on your Docker image prefix, e.g.: `quay.io/development-team/my-awesome-project/backend`. And depending on your environment, a different tag will be appended ( `prod`, `stag`, `branch` ). So, the final image names used will be like: `quay.io/development-team/my-awesome-project/backend:prod`.
- `docker_image_celeryworker`: Docker image for the celery worker. By default, based on your Docker image prefix.
- `docker_image_frontend`: Docker image for the frontend. By default, based on your Docker image prefix.

## Run Cookiecutter

Go to the directory where you want to create your project and run:

```bash
pip install cookiecutter
cookiecutter https://github.com/mongodb-labs/full-stack-fastapi-mongodb.git
```


## Local development

Once the Cookiecutter script has completed, you will have a folder populated with the base project and all input variables customized. 

Change into the project folder and run the `docker-compose` script to build the project containers:

```bash
docker-compose build --no-cache
```

And start them:

```bash
docker-compose up -d 
```

Your Docker Desktop app should look like this:

![Docker Desktop](../img/docker_example.png)

By default, `backend` Python dependencies are managed with [Hatch](https://hatch.pypa.io/latest/). From `./backend/app/` you can install all the dependencies with:

```console
$ hatch env prune
$ hatch env create production
```

Because Hatch doesn't have a version lock file (like Poetry), it is helpful to `prune` when you rebuild to avoid any sort of dependency hell. Then you can start a shell session with the new environment with:

```console
$ hatch shell
```

Make sure your editor uses the environment you just created with Hatch. For Visual Studio Code, from the shell, launch an appropriate development environment with:

```console
$ code .
```

**NOTE:** The React image does not automatically refresh while running in development mode, and any changes will need a rebuild; there is an open [issue](https://github.com/mongodb-labs/full-stack-fastapi-mongodb/issues/15). This gets tired fast, so it's easier to run React outside Docker and call through to the `backend` for API calls. You can then view the frontend at `http://localhost:3000` and the backend api endpoints at `http://localhost/redoc`. This problem won't be a concern in production.

Change into the `/frontend` folder, and:

```bash
yarn install
yarn dev
```

FastAPI `backend` updates will refresh automatically, but the `celeryworker` container must be restarted before changes take effect.

## Starting JupyterLab

If you like to do algorithmic development and testing in Jupyter Notebooks, then launch the `backend` terminal and start Jupyter as follows:

```bash
docker-compose exec backend bash
```

From the terminal:

```bash
$JUPYTER
```

Copy the link generated into your browser and start.

**NOTE:** Notebooks developed in the container are not saved outside, so remember to copy them for persistence. You can do that from inside Jupyter (download), or:

```bash
docker cp <containerId>:/file/path/within/container /host/path/target
```

Or share a folder via `docker-compose.override.yml`.

At this point, development is over to you.
