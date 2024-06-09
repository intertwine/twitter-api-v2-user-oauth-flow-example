import fs from 'fs';
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

export const CONFIG = dotenv.parse(fs.readFileSync(__dirname + '/../.env'));

export const TOKENS = {
  appKey: CONFIG.CONSUMER_TOKEN,
  appSecret: CONFIG.CONSUMER_SECRET,
};

export const CLIENT_AUTH = {
  clientId: CONFIG.CLIENT_ID,
  clientSecret: CONFIG.CLIENT_SECRET,
};

// Create client used to generate auth links only
export const requestClient = new TwitterApi({ ...TOKENS });

// OAuth2 client used to make API calls
export const oauth2Client = new TwitterApi({ ...CLIENT_AUTH });

export default CONFIG;
