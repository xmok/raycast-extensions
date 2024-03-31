import { Icon, List } from "@raycast/api";

export default function ListDetailMetadataComponent({data}: {data: Record<string, any>}) {
    return <List.Item.Detail.Metadata>
        {Object.entries(data).map(([key, val]) => {
            if (typeof val === "boolean") {
                const icon = val ? Icon.Check : Icon.Multiply;
                return <List.Item.Detail.Metadata.Label key={key} title={key} icon={icon} />;
            }
            if (!val) return <List.Item.Detail.Metadata.Label key={key} title={key} icon={Icon.Minus} />;
            if (typeof val === "string" || typeof val === "number") return <List.Item.Detail.Metadata.Label key={key} title={key} text={val.toString()} />
        })}
    </List.Item.Detail.Metadata>
}