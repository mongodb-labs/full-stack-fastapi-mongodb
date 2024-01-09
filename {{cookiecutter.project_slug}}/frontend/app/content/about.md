---
title: Getting started with a base project
description: "Accelerate your next web development project with this FastAPI/Next.js base project generator."
navigation: false
---

# Getting started with a base project

Accelerate your next web development project with this FastAPI/Next.js base project generator.

This project is a comprehensively updated React + MongoDB version of [Sebastián Ramírez's](https://github.com/tiangolo) [Full Stack FastAPI and PostgreSQL Base Project Generator](https://github.com/tiangolo/full-stack-fastapi-postgresql).

---

- [Key features](#key-features)
- [How to use it](#how-to-use-it)
  - [Generate passwords](#generate-passwords)
  - [Input variables](#input-variables)
- [How to deploy](#how-to-deploy)
- [More details](#more-details)
- [Licence](#licence)

---

## Key features

- **Docker Compose** integration and optimization for local development.
- [**FastAPI**](https://github.com/tiangolo/fastapi) backend with [Inboard](https://inboard.bws.bio/) one-repo Docker images:
  - **Authentication** user management schemas, models, crud and apis already built, with OAuth2 JWT token support & default hashing.
  - **SQLAlchemy** version 1.4 support for models.
  - **MJML** templates for common email transactions.
  - **Metadata Schema** based on [Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#section-3) for inheritance.
  - **Common CRUD** support via generic inheritance.
  - **Standards-based**: Based on (and fully compatible with) the open standards for APIs: [OpenAPI](https://github.com/OAI/OpenAPI-Specification) and [JSON Schema](http://json-schema.org/).
  - [**Many other features**]("https://fastapi.tiangolo.com/features/"): including automatic validation, serialization, interactive documentation, etc.
- [**Next/React**](https://react.dev/) frontend:
  - **Authentication** with JWT and cookie management, including `access` and `refresh` tokens,
  - **Authorization** route-based authentication, including support for detecting if a user is logged in or is a superuser.
  - **Model blog** project, with [gray-matter](https://github.com/jonschlinkert/gray-matter) for writing Markdown pages.
  - **State management** with [Redux](https://redux.js.org/), and persistance with [redux-persist](https://github.com/rt2zz/redux-persist).
  - **CSS and templates** with [TailwindCSS](https://tailwindcss.com/), [HeroIcons](https://heroicons.com/), and [HeadlessUI](https://headlessui.com/).
- **MongoDB** database.
- **Celery** worker that can import and use models and code from the rest of the backend selectively.
- **Flower** for Celery jobs monitoring.
- Load balancing between frontend and backend with **Traefik**, so you can have both under the same domain, separated by path, but served by different containers.
- Traefik integration, including Let's Encrypt **HTTPS** certificates automatic generation.
- **Github Actions** (continuous integration), including backend testing.

## How to use it

Go to the directory where you want to create your project and run:

```bash
pip install cookiecutter
cookiecutter https://github.com/mongodb-labs/full-stack-fastapi-mongodb
```

### Generate passwords

You will be asked to provide passwords and secret keys for several components. Open another terminal and run:

```bash
openssl rand -hex 32
# Outputs something like: 99d3b1f01aa639e4a76f4fc281fc834747a543720ba4c8a8648ba755aef9be7f
```

Copy the contents and use that as password / secret key. And run that again to generate another secure key.

### Input variables

The generator (cookiecutter) will ask you for some data, **you might want to have at hand before generating the project.**

The input variables, with their default values (some auto generated) are:

- `project_name`: The name of the project
- `project_slug`: The development friendly name of the project. By default, based on the project name
- `domain_main`: The domain in where to deploy the project for production (from the branch `production`), used by the load balancer, backend, etc. By default, based on the project slug.
- `domain_staging`: The domain in where to deploy while staging (before production) (from the branch `master`). By default, based on the main domain.
- `domain_base_api_url`: The domain url used by the frontend app for backend api calls. If deploying a localhost development environment, likely to be `http://localhost/api/v1`
- `domain_base_ws_url`: The domain url used by the frontend app for backend websocket calls. If deploying a localhost development environment, likely to be `ws://localhost/api/v1`

- `docker_swarm_stack_name_main`: The name of the stack while deploying to Docker in Swarm mode for production. By default, based on the domain.
- `docker_swarm_stack_name_staging`: The name of the stack while deploying to Docker in Swarm mode for staging. By default, based on the domain.

- `secret_key`: Backend server secret key. Use the method above to generate it.
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
- `mongodb_uri`: MongoDB URI for access to the cluster
- `mongodb_database`: MongoDB database to have the application operate within
- `traefik_constraint_tag`: The tag to be used by the internal Traefik load balancer (for example, to divide requests between backend and frontend) for production. Used to separate this stack from any other stack you might have. This should identify each stack in each environment (production, staging, etc).
- `traefik_constraint_tag_staging`: The Traefik tag to be used while on staging.
- `traefik_public_constraint_tag`: The tag that should be used by stack services that should communicate with the public.

- `flower_auth`: Basic HTTP authentication for flower, in the form`user:password`. By default: "`admin:changethis`".

- `sentry_dsn`: Key URL (DSN) of Sentry, for live error reporting. You can use the open source version or a free account. E.g.: `https://1234abcd:5678ef@sentry.example.com/30`.

- `docker_image_prefix`: Prefix to use for Docker image names. If you are using non-native Docker registry it would be based on your code repository. E.g.: `quay.io/development-team/my-awesome-project/`.
- `docker_image_backend`: Docker image name for the backend. By default, it will be based on your Docker image prefix, e.g.: `quay.io/development-team/my-awesome-project/backend`. And depending on your environment, a different tag will be appended ( `prod`, `stag`, `branch` ). So, the final image names used will be like: `git.example.com/development-team/my-awesome-project/backend:prod`.
- `docker_image_celeryworker`: Docker image for the celery worker. By default, based on your Docker image prefix.
- `docker_image_frontend`: Docker image for the frontend. By default, based on your Docker image prefix.

## How to deploy

This stack can be adjusted and used with several deployment options that are compatible with Docker Compose, but it is designed to be used in a cluster controlled with pure Docker in Swarm Mode with a Traefik main load balancer proxy handling automatic HTTPS certificates, using the ideas from [DockerSwarm.rocks](https://dockerswarm.rocks).

Please refer to [DockerSwarm.rocks](https://dockerswarm.rocks) to see how to deploy such a cluster in 20 minutes.

## More details

After using this generator, your new project (the directory created) will contain an extensive `README.md` with instructions for development, deployment, etc. You can pre-read [the project `README.md` template here too](./{{cookiecutter.project_slug}}/README.md).

## Licence

This project is licensed under the terms of the MIT license.
