import { Detail } from "@raycast/api";
import { ISbError } from "storyblok-js-client";

export default function ErrorComponent({ error }: { error: ISbError }) {
    return <Detail navigationTitle="Error" markdown={error.response?.toString()} metadata={<Detail.Metadata>
        <Detail.Metadata.Label title="Message" text={error.message} />
        <Detail.Metadata.TagList title="Status">
            <Detail.Metadata.TagList.Item text={error.status?.toString()} />
        </Detail.Metadata.TagList>
        {error.response && (typeof error.response==="string" ? <Detail.Metadata.Label title="Response" text={error.response} /> : <>
            <Detail.Metadata.Separator />
            <Detail.Metadata.Label title="Response" />
            <Detail.Metadata.Label title="Data" text={error.response.data.toString()} />
            <Detail.Metadata.Label title="Status" text={error.response.status.toString()} />
            <Detail.Metadata.Label title="Status Text" text={error.response.statusText} />
        </>)}
    </Detail.Metadata>} />
}