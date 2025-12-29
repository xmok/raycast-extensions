import * as keymanagement from "oci-keymanagement";
import { common, OCIProvider, useProvider } from "./oci";
import { FormValidation, useCachedPromise, useForm } from "@raycast/utils";
import { onError } from "./utils";
import { Action, ActionPanel, Color, Form, Icon, List, showToast, Toast, useNavigation } from "@raycast/api";
import OpenInOCI from "./open-in-oci";
import ListVaultSecrets from "./secrets";

export default function Command() {
  return (
    <OCIProvider>
      <Vault />
    </OCIProvider>
  );
}

const VaultColor: Partial<Record<keymanagement.models.VaultSummary.LifecycleState, Color>> = {
  ACTIVE: Color.Green,
  CREATING: Color.Orange,
};
function Vault() {
  const { provider } = useProvider();
  const {
    isLoading,
    data: vaults,
    mutate,
  } = useCachedPromise(
    async () => {
      const kmsVaultClient = new keymanagement.KmsVaultClient({ authenticationDetailsProvider: provider });
      const vaults = await kmsVaultClient.listVaults({ compartmentId: provider.getTenantId() });
      return vaults.items ?? [];
    },
    [],
    { initialData: [], onError },
  );

  return (
    <List isLoading={isLoading}>
      {vaults.map((vault) => (
        <List.Item
          key={vault.id}
          icon={{
            value: { source: Icon.Shield, tintColor: VaultColor[vault.lifecycleState] },
            tooltip: vault.lifecycleState,
          }}
          title={vault.displayName}
          accessories={[
            { text: vault.vaultType === keymanagement.models.Vault.VaultType.VirtualPrivate ? "Virtual Private" : "" },
            { date: new Date(vault.timeCreated) },
          ]}
          actions={
            <ActionPanel>
              <Action.Push
                title="View Secrets"
                target={<ListVaultSecrets vaultId={vault.id} provider={provider} />}
                icon={Icon.Key}
              />
              <Action.Push
                icon={Icon.Plus}
                title="Create Vault"
                target={<CreateVault provider={provider} />}
                onPop={mutate}
              />
              <OpenInOCI route="security/kms" />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function CreateVault({ provider }: { provider: common.ConfigFileAuthenticationDetailsProvider }) {
  type FormValues = {
    displayName: string;
  };
  const { pop } = useNavigation();
  const { handleSubmit, itemProps } = useForm<FormValues>({
    async onSubmit(values) {
      const toast = await showToast(Toast.Style.Animated, "Creating", values.displayName);
      try {
        const vaultClient = new keymanagement.KmsVaultClient({ authenticationDetailsProvider: provider });
        await vaultClient.createVault({
          createVaultDetails: {
            compartmentId: provider.getTenantId(),
            displayName: values.displayName,
            vaultType: keymanagement.models.CreateVaultDetails.VaultType.Default,
          },
        });
        toast.style = Toast.Style.Success;
        toast.title = "Created";
        pop();
      } catch (error) {
        onError(error);
      }
    },
    validation: {
      displayName: FormValidation.Required,
    },
  });
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Plus} title="Create Vault" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" placeholder="Name" {...itemProps.displayName} />
    </Form>
  );
}
