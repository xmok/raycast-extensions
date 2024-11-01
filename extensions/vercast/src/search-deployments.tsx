import isValidToken from "./utils/is-valid-token";
import DeploymentsList from "./pages/lists/deployments-list";
import InvalidTokenView from "./pages/details/invalid-token-view";

function Main() {
  if (!isValidToken()) return <InvalidTokenView />;
  return <DeploymentsList />;
}

export default Main;
