import { getPreferenceValues } from "@raycast/api";

export function generateApiWorkspaceUrl() {
    try {
        const { plane_url, worksplace_slug } = getPreferenceValues<Preferences>();
        const url = new URL(`api/v1/workspaces/${worksplace_slug}`, plane_url);
        return url.toString();
    } catch (error) {
        return undefined;
    }
}