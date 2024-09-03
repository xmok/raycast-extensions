import { getPreferenceValues, Image } from "@raycast/api";
import { LogoProps } from "./types";

export function generateApiWorkspaceUrl() {
  try {
    const { plane_url, worksplace_slug } = getPreferenceValues<Preferences>();
    const url = new URL(`api/v1/workspaces/${worksplace_slug}/`, plane_url);
    return url.toString();
  } catch (error) {
    return undefined;
  }
}

export function getProjectIcon(logo: LogoProps): Image.ImageLike {
  if (logo.in_use==="emoji") return logo.emoji.url;
  return { source: "briefcase.svg", tintColor: logo.icon.color };
}