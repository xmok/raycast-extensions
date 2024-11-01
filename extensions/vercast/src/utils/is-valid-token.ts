import { getPreferenceValues, showToast, Toast } from "@raycast/api";

const isValidToken = () => {
  const token = getPreferenceValues<Preferences>().accessToken;
  if (token.length !== 24) {
    showToast({
      style: Toast.Style.Failure,
      title: "Invalid token detected. Please set one in the settings.",
    });
  } else {
    return true;
  }
};

export default isValidToken;
