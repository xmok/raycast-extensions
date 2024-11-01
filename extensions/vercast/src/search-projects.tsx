import InvalidTokenView from "./pages/details/invalid-token-view";
import ProjectListSection from "./pages/lists/projects-list";
import isValidToken from "./utils/is-valid-token";

function Main() {
  if (!isValidToken()) return <InvalidTokenView />;
  return <ProjectListSection />;
}

export default Main;
