import * as vault from "oci-vault";
import * as secrets from "oci-secrets";
import { Color, List, Icon, ActionPanel, Action, Detail, useNavigation, showToast, Toast, Form } from "@raycast/api";
import { useCachedPromise, useForm, FormValidation } from "@raycast/utils";
import { common, keymanagement } from "oci-sdk";
import OpenInOCI from "./open-in-oci";
import { onError } from "./utils";

const SecretColor: Partial<Record<vault.models.SecretSummary.LifecycleState, Color>> = {
  ACTIVE: Color.Green,
  CREATING: Color.Orange,
};
export default function ListVaultSecrets({
  vaultId,
  provider,
}: {
  vaultId: string;
  provider: common.ConfigFileAuthenticationDetailsProvider;
}) {
  const { isLoading, data: secrets } = useCachedPromise(
    async () => {
      const vaultsClient = new vault.VaultsClient({ authenticationDetailsProvider: provider });
      const secrets = await vaultsClient.listSecrets({ compartmentId: provider.getTenantId(), vaultId });
      return secrets.items ?? [];
    },
    [],
    { initialData: [], onError },
  );

  return (
    <List isLoading={isLoading}>
      {secrets.map((secret) => (
        <List.Item
          key={secret.id}
          icon={{
            value: { source: Icon.Key, tintColor: SecretColor[secret.lifecycleState] },
            tooltip: secret.lifecycleState,
          }}
          title={secret.secretName}
          accessories={[{ date: new Date(secret.timeCreated) }]}
          actions={
            <ActionPanel>
              <Action.Push
                icon={Icon.NumberList}
                title="View Secret Versions"
                target={<ViewSecretVersions secretId={secret.id} provider={provider} />}
              />
              <Action.Push
                icon={Icon.Plus}
                title="Create Secret"
                target={<CreateVaultSecret vaultId={vaultId} provider={provider} />}
              />
              <OpenInOCI route={`security/kms/${vaultId}/secrets`} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ViewSecretVersions({
  secretId,
  provider,
}: {
  secretId: string;
  provider: common.ConfigFileAuthenticationDetailsProvider;
}) {
  const { isLoading, data: versions } = useCachedPromise(
    async () => {
      const vaultsClient = new vault.VaultsClient({ authenticationDetailsProvider: provider });
      const versions = await vaultsClient.listSecretVersions({ secretId });
      return versions.items;
    },
    [],
    { onError, initialData: [] },
  );
  return (
    <List isLoading={isLoading}>
      {versions.map((version) => (
        <List.Item
          key={version.versionNumber}
          icon={Icon[`Number${String(version.versionNumber).padStart(2, "0")}` as keyof typeof Icon]}
          title={`${version.versionNumber}${version.stages?.includes(vault.models.SecretVersionSummary.Stages.Current) ? " (Current)" : ""}`}
          accessories={[{ date: new Date(version.timeCreated) }]}
          actions={
            <ActionPanel>
              <Action.Push
                icon={Icon.Box}
                title="View Secret Contents"
                target={
                  <ViewSecretContents secretId={secretId} versionNumber={version.versionNumber} provider={provider} />
                }
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
function ViewSecretContents({
  secretId,
  versionNumber,
  provider,
}: {
  secretId: string;
  versionNumber: number;
  provider: common.ConfigFileAuthenticationDetailsProvider;
}) {
  const { isLoading, data: bundle } = useCachedPromise(
    async () => {
      const secretsClient = new secrets.SecretsClient({ authenticationDetailsProvider: provider });
      const bundle = await secretsClient.getSecretBundle({ secretId, versionNumber });
      return bundle.secretBundle;
    },
    [],
    { onError },
  );

  if (isLoading || !bundle) return <Detail isLoading={isLoading} />;

  return (
    <Detail
      isLoading={isLoading}
      markdown={bundle.secretBundleContent?.content}
      actions={
        <ActionPanel>
          {bundle.secretBundleContent?.content && (
            <Action.CopyToClipboard title="Copy Secret" content={bundle.secretBundleContent?.content} />
          )}
        </ActionPanel>
      }
    />
  );
}

function CreateVaultSecret({
  vaultId,
  provider,
}: {
  vaultId: string;
  provider: common.ConfigFileAuthenticationDetailsProvider;
}) {
  type FormValues = {
    secretName: string;
    description: string;
    keyId: string;
  };
  const { pop } = useNavigation();

  const { isLoading, data: keys } = useCachedPromise(
    async () => {
      const kmsManagementClient = new keymanagement.KmsManagementClient({ authenticationDetailsProvider: provider });
      const keys = await kmsManagementClient.listKeys({ compartmentId: provider.getTenantId() });
      return keys.items;
    },
    [],
    { onError, initialData: [] },
  );
  const { handleSubmit, itemProps } = useForm<FormValues>({
    async onSubmit(values) {
      const toast = await showToast(Toast.Style.Animated, "Creating", values.secretName);
      try {
        const vaultsClient = new vault.VaultsClient({ authenticationDetailsProvider: provider });
        await vaultsClient.createSecret({
          createSecretDetails: {
            compartmentId: provider.getTenantId(),
            vaultId,
            secretName: values.secretName,
            description: values.description,
            keyId: values.keyId,
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
      secretName: FormValidation.Required,
      keyId: FormValidation.Required,
    },
  });
  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Plus} title="Create Secret" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" placeholder="Name" {...itemProps.secretName} />
      <Form.TextField title="Description" placeholder="Description" {...itemProps.description} />
      <Form.Dropdown title="Encryption Key" {...itemProps.keyId}>
        {keys.map((key) => (
          <Form.Dropdown.Item key={key.id} title={key.displayName} value={key.id} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
