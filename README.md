# Getting started

## Development

Copy `.env.sample` to `.env` and fill in the fields

```bash
DATABASE_URL=   # URL to MongoDB
JWT_SECRET_KEY= # Used to encrypt JWT
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

## API

This project use Swagger and you can view the API at [http://localhost:3300/api-docs](http://localhost:3300/api-docs)
