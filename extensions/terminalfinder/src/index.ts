import { LaunchProps } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { applicationToFinder, clipboardToApplication, finderToApplication, Terminal } from "./utils";

export default async function (props: LaunchProps<{ arguments: Arguments.Index }>) {
  const { from, to } = props.arguments;
  try {
    if (from === to) throw new Error("Cannot open in the same place");
    if ((from === "Finder" && to === "Clipboard") || (from !== "Finder" && from !== "Clipboard" && to !== "Clipboard"))
      throw new Error("Invalid combination");

    if (from === "Clipboard") await clipboardToApplication(to as Terminal);
    else if (from === "Finder") await finderToApplication(to as Terminal);
    else await applicationToFinder(from);
  } catch (error) {
    await showFailureToast(error);
  }
}
