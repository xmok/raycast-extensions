import { useFetch, useForm } from "@raycast/utils";
import { API_HEADERS, API_URL, FB_LIMIT, parseFBResponse } from "./featurebase";
import { Action, ActionPanel, ActionPanelSection, Form, Grid, Icon } from "@raycast/api";
import { Changelog, ChangelogState, PaginatedResult } from "./types";
import { useOptimistic, useState } from "react";
import { isObject } from "util";

export default function ManageChangelogs() {
    const [state, setState] = useState("live");
    const {isLoading, data: changelogs, pagination,mutate}  = useFetch((options) => `${API_URL}/changelog?limit=${FB_LIMIT}&page=${options.page+1}&state=${state}`, {
        headers: API_HEADERS,
        parseResponse: parseFBResponse,
        mapResult(result) {
            const {results,page,totalPages} = result as PaginatedResult<Changelog>
            return {
                data: results,
                hasMore: page<totalPages
            }
        },
        initialData:[]
    })
    return <Grid isLoading={isLoading} pagination={pagination} columns={4} searchBarAccessory={<Grid.Dropdown tooltip="State" onChange={setState} storeValue>
        <Grid.Dropdown.Item icon={Icon.Livestream} title="Published" value="live" />
        <Grid.Dropdown.Item icon={Icon.Bookmark} title="Draft" value="draft" />
    </Grid.Dropdown>}>
{!isLoading && !changelogs.length ? <Grid.EmptyView title="Get started with the Changelog" actions={<ActionPanel>
    <Action.Push icon={Icon.Plus} title="New Changelog" target={<NewChangelog />} onPop={mutate} />
</ActionPanel>} /> : changelogs.map(changelog=> <Grid.Item key={changelog.id} content={changelog.featuredImage || "#24283880"} title={changelog.title} subtitle={new Date(changelog.date).toDateString()} accessory={{icon: changelog.state===ChangelogState.Draft ? Icon.Bookmark
    : Icon.Livestream
}} actions={<ActionPanel>

    <Action.Push icon={Icon.Plus} title="New Changelog" target={<NewChangelog />} onPop={mutate} />
</ActionPanel>} />)}
    </Grid>
}

function NewChangelog() {
    const {handleSubmit,itemProps} = useForm({
        onSubmit(values) {
            
        },
    })
return <Form actions={<ActionPanel>
    <Action.SubmitForm icon={Icon.Plus} title="New Changelog" onSubmit={handleSubmit} />
</ActionPanel>}>
    
</Form>
}