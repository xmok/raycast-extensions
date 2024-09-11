import {
  Action,
  ActionPanel,
  Alert,
  Form,
  Icon,
  Keyboard,
  List,
  Toast,
  confirmAlert,
  showToast,
  useNavigation,
} from "@raycast/api";
import DomainSelector from "./components/DomainSelector";
import { useEffect, useState } from "react";
import { Alias, AliasCreate } from "./utils/types";
import { createDomainAlias, deleteDomainAlias, getDomainAliases } from "./utils/api";
import { FormValidation, useFetch, useForm } from "@raycast/utils";
import { APP_URL } from "./utils/constants";
import ErrorComponent from "./components/ErrorComponent";
import { useAliases } from "./utils/hooks";

export default function Aliases() {
  const { push } = useNavigation();
  const handleDomainSelected = (domain: string) => push(<AliasesIndex domain={domain} />);
  return <DomainSelector onDomainSelected={handleDomainSelected} />;
}

type AliasesIndexProps = {
  domain: string;
};
function AliasesIndex({ domain }: AliasesIndexProps) {
  const { isLoading, data: aliases, error, revalidate, mutate } = useAliases(domain);

  if (error) return <ErrorComponent error={error.message} />

  async function confirmAndDelete(alias: Alias) {
    const message = `${alias.from}@${domain} -> ${alias.to}`;
    if (
      await confirmAlert({
        title: `Delete '${message}`,
        primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
      })
    ) {
      const toast = await showToast(Toast.Style.Animated, "Deleting alias", message);
      try {
        await mutate(
          deleteDomainAlias(domain, alias),
          {
            optimisticUpdate(data) {
              return data.filter(a => a.from!==alias.from && a.to!==alias.to);
            },
          }
        )
        toast.style = Toast.Style.Success;
        toast.title = "Deleted alias";
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Could not delete alias";
      }
    }
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search alias">
      <List.Section title={`${domain}`} subtitle={`${aliases.length} ${aliases.length === 1 ? "alias" : "aliases"}`}>
        {!isLoading &&
          aliases.map((alias, aliasIndex) => (
            <List.Item
              key={aliasIndex}
              title={alias.from + " -> " + alias.to}
              icon={Icon.TwoPeople}
              actions={
                <ActionPanel>
                  <Action
                    title="Delete Alias"
                    icon={Icon.RemovePerson}
                    style={Action.Style.Destructive}
                    onAction={() => confirmAndDelete(alias)}
                  />
                  <ActionPanel.Section>
                    <Action.OpenInBrowser title="View Aliases Online" url={`${APP_URL}domains/${domain}`} />
                    <Action.Push
                      title="Create New Alias"
                      icon={Icon.AddPerson}
                      target={<AliasesCreate domain={domain} onAliasCreated={revalidate} />}
                      shortcut={Keyboard.Shortcut.Common.New}
                    />
                    <Action title="Reload Aliases" icon={Icon.Redo} onAction={revalidate} shortcut={Keyboard.Shortcut.Common.Refresh} />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
      {!isLoading && (
        <List.Section title="Actions">
          <List.Item
            title="Create New Alias"
            icon={Icon.AddPerson}
            actions={
              <ActionPanel>
                <Action.Push
                  title="Create New Alias"
                  icon={Icon.AddPerson}
                  target={<AliasesCreate domain={domain} onAliasCreated={revalidate} />}
                />
              </ActionPanel>
            }
          />
          <List.Item
            title="Reload Aliases"
            icon={Icon.Redo}
            actions={
              <ActionPanel>
                <Action title="Reload Aliases" icon={Icon.Redo} onAction={revalidate} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}
    </List>
  );
}

type AliasesCreateProps = {
  domain: string;
  onAliasCreated: () => void;
};
function AliasesCreate({ domain, onAliasCreated }: AliasesCreateProps) {
  const { pop } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, itemProps } = useForm<AliasCreate>({
    async onSubmit(values) {
      setIsLoading(true);

      const newAlias = { ...values };
      const response = await createDomainAlias(domain, newAlias);
      if (!("errors" in response)) {
        showToast(Toast.Style.Success, "Created Alias", `${response.from} -> ${response.to}`);
        onAliasCreated();
        pop();
      }
      setIsLoading(false);
    },
    validation: {
      from: FormValidation.Required,
      to: FormValidation.Required,
    },
  });
  return (
    <Form
      isLoading={isLoading}
      navigationTitle="Create Alias"
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Check} onSubmit={handleSubmit} />
          <Action.OpenInBrowser
            icon={Icon.Globe}
            title="Go To API Reference"
            url="https://mailwip.com/api/?javascript#email-aliases"
          />
        </ActionPanel>
      }
    >
      <Form.Description title="Domain" text={domain} />

      <Form.Separator />
      <Form.TextField title="From" placeholder="temporary" info="use * for catch all" {...itemProps.from} />
      <Form.Description text={`${itemProps.from.value || "[ADDRESS]"}@${domain}`} />
      <Form.TextField
        title="To"
        placeholder="personal@example.org"
        info="Forward to this Email Address"
        {...itemProps.to}
      />
    </Form>
  );
}
