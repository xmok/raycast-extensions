import { getPreferenceValues } from "@raycast/api";
import 'isomorphic-fetch';
import StoryblokClient from "storyblok-js-client";

const preferences = getPreferenceValues<Preferences>();
const OAUTH_TOKEN = preferences.oathToken;
const REGION = preferences.region;

export const Storyblok = new StoryblokClient({
    oauthToken: OAUTH_TOKEN,
    region: REGION
})