# Flop - Littlescreen

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

In order to generate the API types for the API client, download the `spec.json` from [the flop-server](https://github.com/52-card-pickup/flop-server) and run the following command:

```sh
npx openapi-typescript /path/to/spec.json -o ./spec.ts
```
