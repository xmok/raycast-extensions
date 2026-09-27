import { Action, ActionPanel, Detail, LaunchProps } from "@raycast/api";

export default function GenerateRoboHashAvatar(props: LaunchProps<{ arguments: Arguments.GenerateRobohashAvatar }>) {
  const { text, bgset, set } = props.arguments;
  const params = new URLSearchParams({ bgset, set });
  const url = `https://robohash.org/${text}?${params}`;
  return (
    <Detail
      markdown={`![RoboHash](${url})
---
\`${url}\`
\n\n
| - | - |
|---|---|
| Text | ${text} |
| bg | ${bgset} |
| set | ${set} |`}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy URL to Clipboard" content={url} />
          <Action.OpenInBrowser title="Open URL in Browser" url={url} />
        </ActionPanel>
      }
    />
  );
}
