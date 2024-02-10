# Chirper API

## Description

### Purpose

This project is only for development and learning purposes. Main reason for creating this project is to learn frameworks, libraries which I found interesting and improve on writing code.

### What is it?

Chirper API is a backend for Chirper which is a website you can create posts for other people to read and comment on, similar to Twitter (X).

You can find the Chirper frontend project at [https://github.com/ho-stanley/chirper](https://github.com/ho-stanley/chirper)

## Getting started

### Development

Copy `.env.sample` to `.env` and fill in the fields

```bash
DATABASE_URL=   # URL to MongoDB
JWT_SECRET_KEY= # Used to encrypt JWT
```

You can generate a secret key with OpenSSL or Node

```bash
openssl rand -base64 172 | tr -d '\n'
# or
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run start:dev
# or
yarn start:dev
```

The server URL is [http://localhost:3300](http://localhost:3300)

### API

This project use Swagger and you can view the API at [http://localhost:3300/api-docs](http://localhost:3300/api-docs)
