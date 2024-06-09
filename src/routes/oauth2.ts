import { Router } from "express";
import { TwitterApi } from "twitter-api-v2";
import CONFIG, { oauth2Client, CLIENT_AUTH } from "../config";
import { asyncWrapOrError } from "../utils";

export const oauth2Router = Router();

// -- FLOW 1: --
// -- Oauth2 Callback flow --

const CALLBACK_URL = `http://localhost:${CONFIG.PORT}/oauth2_callback`;
const OAUTH2_SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "offline.access",
];

// Serve HTML index page with callback link
oauth2Router.get(
  "/oauth2",
  asyncWrapOrError(async (req, res) => {
    const { url, codeVerifier, state } = oauth2Client.generateOAuth2AuthLink(
      CALLBACK_URL,
      { scope: OAUTH2_SCOPES }
    );
    // Save token secret to use it after callback
    req.session.state = state;
    req.session.codeVerifier = codeVerifier;

    res.render("index", { authLink: url, authMode: "oauth2" });
  })
);

// Read data from Twitter callback
oauth2Router.get(
  "/oauth2_callback",
  asyncWrapOrError(async (req, res) => {
    // Extract state and code from query string
    const { state, code } = req.query;
    // Get the saved codeVerifier from session
    const { codeVerifier, state: sessionState } = req.session;

    if (!codeVerifier || !state || !sessionState || !code) {
      return res
        .status(400)
        .send("You denied the app or your session expired!");
    }
    if (state !== sessionState) {
      return res.status(400).send("Stored tokens didnt match!");
    }

    // Build a temporary client to get access token
    const tempClient = new TwitterApi({
      ...CLIENT_AUTH,
    });

    const codeAsString = code as string;

    tempClient
      .loginWithOAuth2({
        code: codeAsString,
        codeVerifier,
        redirectUri: CALLBACK_URL,
      })
      .then(
        async ({
          client: loggedClient,
          accessToken,
          refreshToken,
          expiresIn,
        }) => {
          const currentUser = await loggedClient.currentUserV2();
          res.render("oauth2", {
            ...currentUser.data,
            accessToken,
            refreshToken,
            expiresIn,
          });
        }
      )
      .catch(() => {
        res.status(403).send("Invalid verifier or access tokens!");
      });
  })
);

export default oauth2Router;
