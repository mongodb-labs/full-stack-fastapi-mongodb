# Building an App with the Base Project Generator

This page will walk you through the fundamentals of how this app generator works as well as where to look for further details. To learn more about making a production-ready generated application, please read the below sections.

1. [Development and installation](development-guide.md)
2. [Deployment for production](deployment-guide.md)
3. [Authentication and magic tokens](authentication-guide.md)
4. [Websockets for interactive communication](websocket-guide.md)
5. [Generated project `README.md` template](../{{cookiecutter.project_slug}}/README.md)

---

## Contents

- [What is it?](#what-is-it)
- [Who is it for?](#who-is-it-for)
- [What does it look like?](#what-does-it-look-like)
- [How to use it](#how-to-use-it)
- [Release notes](#release-notes)
- [License](#license)

## What is it?

This FastAPI, React, MongoDB repo will generate a complete web application stack as a foundation for your project development.

- **Docker Compose** integration and optimization for local development.
- **Authentication** user management schemas, models, crud and apis already built, with OAuth2 JWT token support & default hashing. Offers _magic link_ authentication, with password fallback, with cookie management, including `access` and `refresh` tokens.
- [**FastAPI**](https://github.com/tiangolo/fastapi) backend with [Inboard](https://inboard.bws.bio/) one-repo Docker images:
  - **Mongo Motor** https://motor.readthedocs.io/en/stable/
  - **MongoDB ODMantic** for handling ODM creation https://art049.github.io/odmantic/
  - **Common CRUD** support via generic inheritance.
  - **Standards-based**: Based on (and fully compatible with) the open standards for APIs: [OpenAPI](https://github.com/OAI/OpenAPI-Specification) and [JSON Schema](http://json-schema.org/).
  - [**Many other features**]("https://fastapi.tiangolo.com/features/"): including automatic validation, serialization, interactive documentation, etc.
- [**Nextjs/React**](https://nextjs.org/) frontend:
  - **Authorization** route-based authentication, including support for detecting if a user is logged in or is a superuser.
  - **Model blog** project, with [Nuxt Content](https://content.nuxtjs.org/) for writing Markdown pages.
  - **Form validation** with [React useForm](https://react-hook-form.com/docs/useform)
  - **State management** with [Redux](https://redux.js.org/)
  - **CSS and templates** with [TailwindCSS](https://tailwindcss.com/), [HeroIcons](https://heroicons.com/), and [HeadlessUI](https://headlessui.com/).
- **Celery** worker that can import and use models and code from the rest of the backend selectively.
- **Flower** for Celery jobs monitoring.
- Load balancing between frontend and backend with **Traefik**, so you can have both under the same domain, separated by path, but served by different containers.
- Traefik integration, including Let's Encrypt **HTTPS** certificates automatic generation.
- **Github Actions** (continuous integration), including backend testing.


## Who is it for?

This project is a rock-solid foundation on which to build complex web applications which need parallel processing, scheduled event management, leveraging a NoSQL Datastore (MongoDB). The base deployment requires about 2Gb of memory to run. 

This is **not** a light-weight system to deploy a blog or simple content-management-system.

It is for developers looking to build and maintain full feature progressive web applications that can run online, or offline, want the complex-but-routine aspects of auth 'n auth, and component and deployment configuration taken care of. 

## What does it look like?

### App landing page

![Landing page](../img/landing.png)

### Dashboard Login

![Magic-link login](../img/login.png)

### Dashboard User Management

![Moderator user management](../img/dashboard.png)

### Interactive API documentation

![Interactive API docs](../img/redoc.png)

### Enabling two-factor security (TOTP)

![Enabling TOTP](../img/totp.png)

## How to use it

### Installing for local development

Running Cookiecutter to customise the deployment with your settings, and then building with Docker compose, takes about 20 minutes.

- [Development and installation](development-guide.md)

### Setting up a Mongo Connection

A Mongo connection can be set up one of two ways: At the cookiecutter generation step, provide the `mongodb_uri`, and `mongo_database` to inform the generator on how to connect to an Atlas cloud instance. Additionally, in the generated file, you can manually leave the `.env.MONGO_DATABASE_URI` as `mongodb` and it will automatically connect to the running mongodb docker instance.

Whilst the local instance is available, it is best advised to create or [connect to a MongoDB Atlas Cluster](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/).

### Deploying for production

This stack can be adjusted and used with several deployment options that are compatible with Docker Compose, but it is designed to be used in a cluster controlled with pure Docker in Swarm Mode with a Traefik main load balancer proxy handling automatic HTTPS certificates, using the ideas from [DockerSwarm.rocks](https://dockerswarm.rocks).

- [Deployment for production](deployment-guide.md)

### Authentication with magic and TOTP

Time-based One-Time Password (TOTP) authentication extends the login process to include a challenge-response component where the user needs to enter a time-based token after their preferred login method.

- [Authentication and magic tokens](authentication-guide.md)

### More details

After using this generator, your new project will contain an extensive `README.md` with instructions for development, deployment, etc. You can pre-read [the project `README.md` template here too](../{{cookiecutter.project_slug}}/README.md).
