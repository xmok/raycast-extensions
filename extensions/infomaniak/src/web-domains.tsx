import { LaunchProps, List } from "@raycast/api";

export default function Command(props: LaunchProps<{arguments: Arguments.WebDomains}>) {
  switch (props.arguments.item) {
    case "domains":
      return <Domains />;
  }
}

function Domains() {
  return <List></List>
}