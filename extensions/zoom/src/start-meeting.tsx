import { open, closeMainWindow, Clipboard, popToRoot, showToast, Toast, showHUD } from "@raycast/api";
import { createInstantMeeting } from "./api/meetings";
import { zoom } from "./components/withZoomAuth";
import { getErrorMessage } from "./helpers/errors";

export default async function Command() {
  const token = await zoom.authorize();

  const toast = await showToast({ style: Toast.Style.Animated, title: "Creating meeting" });
  try {
    const meeting = await createInstantMeeting(token);

    await open(meeting.join_url);

    await Clipboard.copy(meeting.join_url);
    await showHUD("Copied Join URL to clipboard");

    await closeMainWindow();
    await popToRoot();
  } catch (error) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to create meeting";
    toast.message = getErrorMessage(error);
  }
}
