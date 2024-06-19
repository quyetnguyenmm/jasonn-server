# JASONN Server

This is a simple fake REST API customized based on JSON Server.

Created with <3 for newbie front-end developers who need a simple API to use for testing or learning only.

## Table of contents

<!-- toc -->

- [Getting started](#getting-started)
  - [Database](#database)
  - [Homepage](#homepage)
- [Extras](#extras)
  - [Alternative port](#alternative-port)

<!-- tocstop -->

## Getting started

Install JSON Server

```
npm install jasonn-server     # NPM
yarn add jasonn-server        # Yarn
```

Create a `db.json` file with some data

```json
{
  "posts": [{ "id": 1, "title": "json-server", "author": "typicode" }],
  "comments": [{ "id": 1, "body": "some comment", "postId": 1 }],
  "profile": { "name": "typicode" }
}
```

Start JASONN Server

```bash
npx jasonn-server db.json
```

Now if you go to [http://localhost:8080/posts/1](http://localhost:8080/posts/1), you'll get

```json
{ "id": 1, "title": "json-server", "author": "typicode" }
```

### Database

```
GET /api/db
```

### Homepage

```
GET /
```

## Extras

### Alternative port

You can start JASONN Server on other ports with the `--port` flag:

```bash
$ jasonn-server db.json --port 3004
```

**Tip** use modules like [Faker](https://github.com/faker-js/faker), [Casual](https://github.com/boo1ean/casual), [Chance](https://github.com/victorquinn/chancejs) or [JSON Schema Faker](https://github.com/json-schema-faker/json-schema-faker).
