import { ICONS_BASE_URL } from "./constants";

export function getIconURL(icon: string | undefined) {
    return icon ? ICONS_BASE_URL + icon + ".png" : icon;;
}