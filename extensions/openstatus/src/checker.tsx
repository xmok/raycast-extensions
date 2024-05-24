import { Detail, LaunchProps } from "@raycast/api";
import { CheckerResponse } from "./types";
import { useFetch } from "@raycast/utils";
import { API_HEADERS, OPENSTATUS_URL } from "./constants";

export default function Checker(props: LaunchProps<{ arguments: Arguments.Checker }>) {
    const { region, url, method } = props.arguments;
    // Since Checker is a separate service, we call it directly w/o useOpenStatus
    const checker_url = new URL(OPENSTATUS_URL); // ensure the URL is valid
    checker_url.hostname = `checker.${checker_url.hostname}`; // use checker subdomain
    checker_url.pathname = `ping/${region}`; // append the api paths
    console.log(checker_url);
    const { isLoading, data } = useFetch<CheckerResponse>(checker_url.toString(), {
        method: "POST",
        headers: {
            ...API_HEADERS,
            "prefer-fly-region": region
        },
        body: JSON.stringify({
            url, method
        })
    });

    return <Detail isLoading={isLoading} markdown={!data ? undefined : `\`\`\`json\n${JSON.stringify(data, null, 4)}`} metadata={!data ? undefined : <Detail.Metadata>
        <Detail.Metadata.Label title="Status" text={data.status.toString()} />
        <Detail.Metadata.Label title="Latency" text={data.latency.toString()} />
        <Detail.Metadata.Separator />
        <Detail.Metadata.Label title="Headers" />
        {Object.entries(data.headers).map(([key, val]) => <Detail.Metadata.Label key={key} title={key} text={val} />)}
        <Detail.Metadata.Separator />
        <Detail.Metadata.Label title="Time" text={new Date(data.time).toString()} />
        <Detail.Metadata.Separator />
        <Detail.Metadata.Label title="Timing" />
        {Object.entries(data.timing).map(([key, val]) => <Detail.Metadata.Label key={key} title={key} text={new Date(val).toString()} />)}
    </Detail.Metadata>} />
}