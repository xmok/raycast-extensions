import { Action, ActionPanel, Detail, LaunchProps } from "@raycast/api";

export default function GenerateRoboHashAvatar(props: LaunchProps<{ arguments: Arguments.GenerateRobohashAvatar }>) {
    const { text, bgset, set } = props.arguments;
    const params = new URLSearchParams({bgset, set});
    return <Detail markdown={`![RoboHash](https://robohash.org/${text}?${params})
---
text: ${text} \n\n bg: ${bgset} \n\n set: ${set}`} actions={<ActionPanel>
    <Action title="Next Background" onAction={} />
</ActionPanel>} />
}