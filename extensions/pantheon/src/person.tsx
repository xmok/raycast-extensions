import { useState } from "react";
import { type Person } from "./lib/types";
import usePantheon from "./lib/usePantheon";
import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

export default function Person() {
    const [isShowingDetail, setIsShowingDetail] = useCachedState("details-person", false);
    const [query, setQuery] = useState({
        key: "name",
        val: ""
    });
    
    const { isLoading, data: persons, pagination } = usePantheon<Person>("person", query);

    return <List isLoading={isLoading} isShowingDetail={isShowingDetail} throttle pagination={pagination} searchBarPlaceholder={`Search by ${query.key}`} onSearchTextChange={(val) => setQuery(prev => ({...prev, val}))} searchBarAccessory={<List.Dropdown tooltip="Search" onChange={(key) => setQuery(prev => ({...prev, key}))}>
        <List.Dropdown.Item title="Name" value="name" />
        <List.Dropdown.Item title="Description" value="description" />
    </List.Dropdown>}>
        {persons.map((person, personIndex) => <List.Item key={personIndex + "_" + person.id} title={person.name} icon={{ source: person.gender==="M" ? Icon.Male : Icon.Female, tintColor: person.alive ? Color.Green : Color.Red }} subtitle={!isShowingDetail ? person.slug : undefined} accessories={isShowingDetail ? undefined : [{tag: person.occupation}]} detail={<List.Item.Detail markdown={`${person.description || "<NO DESCRIPTION>"} \n\n ${person.famous_for || ""}`} metadata={<List.Item.Detail.Metadata>
            <List.Item.Detail.Metadata.Label title="Name" text={person.name} />
            <List.Item.Detail.Metadata.Link title="Wikipedia" text={`https://en.wikipedia.org/wiki?curid=${person.wp_id}`} target={`https://en.wikipedia.org/wiki?curid=${person.wp_id}`} />
            <List.Item.Detail.Metadata.Link title="Wikidata" text={`https://www.wikidata.org/wiki/${person.wd_id}`} target={`https://www.wikidata.org/wiki/${person.wd_id}`} />
            <List.Item.Detail.Metadata.Link title="Pantheon" text={`https://pantheon.world/profile/person/${person.slug}`} target={`https://pantheon.world/profile/person/${person.slug}`} />
            <List.Item.Detail.Metadata.TagList title="Occupation">
                <List.Item.Detail.Metadata.TagList.Item text={person.occupation} />
                <List.Item.Detail.Metadata.TagList.Item text={`Probability: ${person.prob_ratio}`} />
            </List.Item.Detail.Metadata.TagList>
            <List.Item.Detail.Metadata.Label title="Gender" text={person.gender || "N/A"} />
            <List.Item.Detail.Metadata.Label title="Alive" icon={person.alive ? Icon.Check : Icon.Minus} />
            {person.twitter ? <List.Item.Detail.Metadata.Link title="X (Twitter)" text={person.twitter} target={`https://twitter.com/${person.twitter}`} /> : <List.Item.Detail.Metadata.Label title="Twitter" icon={Icon.Minus} />}
            {person.youtube ? <List.Item.Detail.Metadata.Link title="YouTube" text={person.youtube} target={`https://youtube.com?v=${person.youtube}`} /> : <List.Item.Detail.Metadata.Label title="Youtube" icon={Icon.Minus} />}
            <List.Item.Detail.Metadata.Separator />
            <List.Item.Detail.Metadata.Label title="Memorability indicators (static)" />
            <List.Item.Detail.Metadata.Label title="Wikipedia biographies" text={person.l?.toString() || "N/A"} />
            <List.Item.Detail.Metadata.Label title="Wikipedia pageviews (2007-2016)" text={person.l_prev?.toString() || "N/A"} />
            <List.Item.Detail.Metadata.Label title="Human popularity index" text={person.hpi?.toString() || "N/A"} />
        </List.Item.Detail.Metadata>} />} actions={<ActionPanel>
            <Action title="Toggle Details" icon={Icon.AppWindowSidebarLeft} onAction={() => setIsShowingDetail(prev => !prev)} />
        </ActionPanel>} />)}
    </List>
}