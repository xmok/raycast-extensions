import { ActionPanel, Action, Icon, List, getPreferenceValues, Detail, openExtensionPreferences } from "@raycast/api";
import { useCachedPromise, useFetch } from "@raycast/utils";
import { Link, PaginatedResult } from "./types";

const { kutt_url, api_key } = getPreferenceValues<Preferences>();
const LIMIT = 20;
const buildApiUrl = (endpoint="") => new URL(`api/v2/${endpoint}`, kutt_url).toString();
const parseApiResponse = async (response: Response) => {
  const result = await response.json();
  if (!response.ok) throw new Error((result as {error: string}).error);
  return result;
}

export default function Command() {
  try {
    buildApiUrl();
    return <SearchLinks />
  } catch {
    return <Detail markdown={"# ERROR \n\n Invalid URL in `Preferences`"} actions={<ActionPanel>
      <Action icon={Icon.Gear} title="Open Extension Preferences" onAction={openExtensionPreferences} />
    </ActionPanel>} />
  }
}

function SearchLinks() {
  const { isLoading, data: links } = useCachedPromise(() => async (options) => {
    const response = await fetch(buildApiUrl(`links?limit=${LIMIT}&skip=${options.page * LIMIT}`), {
      headers: {
        "X-API-KEY": api_key
      }
    })
    const result = await parseApiResponse(response) as PaginatedResult<Link>;
    return {
      data: result.data,
      hasMore: result.total > result.skip + result.limit
    }
    
  }, [],{ initialData: [] })


  return <List isLoading={isLoading}>
    {!isLoading && !links.length ? <List.EmptyView title="No links." /> : links.map(link => <List.Item key={link.id} title={link.link} />)}
  </List>
}
