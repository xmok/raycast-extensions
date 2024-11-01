import InvalidTokenView from "./pages/details/invalid-token-view";
import DomainListSection from "./pages/lists/domains-list";
import isValidToken from "./utils/is-valid-token";

function Main() {
  if (!isValidToken()) return <InvalidTokenView />;
  return <DomainListSection />;
}

export default Main;
