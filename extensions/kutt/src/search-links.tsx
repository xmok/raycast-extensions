import { ActionPanel, Action, Icon, List, getPreferenceValues, Detail, openExtensionPreferences, Form, showToast, Toast, useNavigation, confirmAlert, Color, Alert } from "@raycast/api";
import { FormValidation, getFavicon, useCachedPromise, useFetch, useForm } from "@raycast/utils";
import { CreateLinkRequest, Link, LinkStats, PaginatedResult, StatsItem } from "./types";

const { kutt_url, api_key } = getPreferenceValues<Preferences>();
const LIMIT = 20;
const buildApiUrl = (endpoint="") => new URL(`api/v2/${endpoint}`, kutt_url).toString();
const parseApiResponse = async (response: Response) => {
  const result = await response.json();
  if (!response.ok) throw new Error((result as {error: string}).error);
  return result;
}
const API_HEADERS = {
  "X-API-KEY": api_key,
  "Content-Type": "application/json"
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
  const { isLoading, data: links, mutate } = useCachedPromise(() => async (options) => {
    const response = await fetch(buildApiUrl(`links?limit=${LIMIT}&skip=${options.page * LIMIT}`), {
      headers: API_HEADERS
    })
    const result = await parseApiResponse(response) as PaginatedResult<Link>;
    return {
      data: result.data,
      hasMore: result.total > result.skip + result.limit
    }
    
  }, [],{ initialData: [] })


  return <List isLoading={isLoading}>
    {!isLoading && !links.length ? <List.EmptyView title="No links." actions={<ActionPanel>
      <Action.Push icon={Icon.Plus} title="Create Link" target={<CreateLink />} onPop={mutate} />
    </ActionPanel>} /> : links.map(link => <List.Item key={link.id} icon={getFavicon(link.target, {fallback: Icon.Link})} title={link.target} subtitle={link.link} accessories={[{icon: Icon.Eye, text: link.visit_count.toString()}, {date: new Date(link.created_at)}]} actions={<ActionPanel>
      <Action.Push icon={Icon.PieChart} title="View Link Stats" target={<LinkStats link={link} />} />
      <Action.CopyToClipboard title="Copy Short Link" content={link.link} />
      <Action icon={Icon.Trash} title="Delete Link" onAction={() => confirmAlert({
        icon: {source:Icon.Trash, tintColor: Color.Red},
        title: "Delete Link",
        message: `Are you sure do you want to delete the link "${link.link.replace("https://", "")}"?`,
        primaryAction: {
          style: Alert.ActionStyle.Destructive,
          title: "Delete",
          async onAction() {
            const toast = await showToast(Toast.Style.Animated, "Deleting link", link.link)
            try {
              await mutate(
                fetch(buildApiUrl(`links/${link.id}`), {
                  method: "DELETE",
                  headers: API_HEADERS
                }), {
                  optimisticUpdate(data) {
                    return data.filter(l => l.id !==link.id)
                  },
                  shouldRevalidateAfter: false,
                }
              )
              toast.style = Toast.Style.Success
              toast.title = "Link deleted"
              toast.message = link.link
            } catch (error) {
              toast.style = Toast.Style.Failure
              toast.title = "Failed to delete link"
              toast.message = `${error}`
            }
              
          },
        }
      })} style={Action.Style.Destructive} />
      <Action.Push icon={Icon.Plus} title="Create Link" target={<CreateLink />} onPop={mutate} />
    </ActionPanel>} />)}
  </List>
}

function CreateLink() {
  const {pop} = useNavigation()
  const { handleSubmit, itemProps } = useForm<CreateLinkRequest>({
    async onSubmit(values) {
      const toast = await showToast(Toast.Style.Animated, "Creating link", values.target)
      try {
        const response = await fetch(buildApiUrl("links"), {
          method: "POST",
          headers: API_HEADERS,
          body: JSON.stringify(values)
        })
        const result = await parseApiResponse(response) as Link;
        await showToast(Toast.Style.Success, "Link created", result.link);
        pop()
      } catch (error) {
        toast.style = Toast.Style.Failure
        toast.title = "Failed to create link"
        toast.message = `${error}`
      }
    },
    validation: {
      target: FormValidation.Required
    }
  })

  return <Form actions={<ActionPanel>
    <Action.SubmitForm icon={Icon.Plus} title="Create Link" onSubmit={handleSubmit} />
  </ActionPanel>}>
    <Form.TextField title="Target URL" placeholder="Paste your long URL" {...itemProps.target} />
    <Form.Separator />
    <Form.TextField title="Custom address" placeholder="Custom address" {...itemProps.customurl} />
    <Form.PasswordField title="Password" placeholder="Password" {...itemProps.password} />
    <Form.TextField title="Expire in" placeholder="2 minutes/hours/days" {...itemProps.expire_in} />
    <Form.TextField title="Description" placeholder="Description" {...itemProps.description} />
  </Form>
}

function StatListItem({title, item}:{title:string, item: StatsItem}) {
  return <List.Item title={title} detail={<List.Item.Detail metadata={<List.Item.Detail.Metadata>
    {/* <List.Item.Detail.Metadata.Label title="Views" value={item.view.length} /> */}
  </List.Item.Detail.Metadata>} />} />
}
function LinkStats({link}:{link:Link}) {
  const {isLoading, data} = useFetch(buildApiUrl(`links/${link.id}/stats`), {
    headers: API_HEADERS,
    parseResponse: parseApiResponse,
    mapResult(result) {
      return{
        data: result as LinkStats
      }
    },
  })

  return <List isLoading={isLoading}>
    {data && <>
    <StatListItem title="Year" item={data.lastYear} />
    <StatListItem title="Month" item={data.lastMonth} />
    <StatListItem title="Week" item={data.lastWeek} />
    <StatListItem title="Day" item={data.lastDay} />
    </>}
  </List>
}
