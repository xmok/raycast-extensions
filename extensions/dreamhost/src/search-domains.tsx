import { getPreferenceValues, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";

type DNSRecord = {
    record: string;
    type: string;
    account_id: string;
    comment: string;
    zone: string;
    editable: string;
    value: string;
}
type SuccessResult<T> = {
    result: "success"
    data: T;
}
type ErrorResult = {
    result: "error"
    data: string;
    reason?: string;
}

const { api_key } = getPreferenceValues<Preferences>();

export default function SearchDomains() {
    const {isLoading, data: records} = useFetch(`https://api.dreamhost.com/?key=${api_key}&format=json&cmd=dns-list_records`, {
        async parseResponse(response) {
            const txt = await response.text();
            const result: ErrorResult | SuccessResult<DNSRecord[]> = await JSON.parse(txt);
            if (result.result==="error") throw new Error(result.reason || result.data);
            return result.data;
        },
        initialData: []
    })

    return <List isLoading={isLoading}>
        {records.map((record, index) => <List.Item key={index} icon={`https://${record.zone}`} title={record.record===record.zone ? "@" : record.record.split(".")[0]} subtitle={record.zone} />)}
    </List>
}