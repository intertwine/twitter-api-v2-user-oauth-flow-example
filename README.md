# twitter-api-v2-user-oauth-example

This project shows you how to make a simple 3-legged OAuth flow, with both PIN code and callback support.

## Requirements

### Packages

Install all packages of project, configure .env with required properties, then start TypeScript compiler.

```bash
npm i
cp .example.env .env
# ...configure .env with consumer keys for OAuth1 or client keys for OAuth2
# then start the server
npm run start
```

### Twitter app config

- Copy `.example.env` to `.env` file
- Add your consumer key + consumer secret (for OAuth1) or client id + client secret (for OAuth2) to `.env` file
- Ensure `http://localhost:5001/callback` and `http://localhost:5001/oauth2_callback` are present in allowed callback URLs,
inside your Twitter application settings (in developer portal).

## Testing the app

Navigate to `http://localhost:5000` to test **callback-based flow**.

Navigate to `http://localhost:5000/pin-flow` to test **PIN-based flow**.

Navigate to `http://localhost:5000/oauth2` to test **OAuth2 flow**.

## How it works

### Callback flow

1) It generates an authentication link (`routes/callback.ts`, `router.get('/')`) that renders into `views/index.ejs`.
2) User clicks link, and is redirected to `routes/callback.ts`, `router.get('/callback')` route.
3) Route stores tokens into session to generate definitive access token, then renders `views/callback.ejs` with access tokens data.

### PIN flow

1) It generates an authentication link (`routes/pin.ts`, `router.get('/pin-flow')`) that renders into `views/index.ejs`.
2) User clicks link, opening the auth invite in a new tab, that shows a PIN code when accepted.
3) User enters PIN manually into an input, then triggers `routes/pin.ts`, `router.get('/validate-pin')` route on button click.
Information about login is printed on screen.

### OAuth2 flow

1) It generate a authentification link (`routes/oauth2.ts`, `router.get('/oauth2')`) that renders into `views/index.ejs`.
2) User clicks link, and is redirected to `routes/oauth2.ts`, `router.get('/oauth2_callback')` route.
3) Route stores tokens into session to generate definitive access and refresh tokens, then renders `views/oauth2.ejs` with tokens and user data.
