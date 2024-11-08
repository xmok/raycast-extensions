import { Action, ActionPanel, List } from "@raycast/api";
import { useSales } from "./hooks";
import { withAccessToken } from "@raycast/utils";
import { provider } from "./oauth";

export default withAccessToken(provider)(Sales);

function Sales() {
  const { isLoading, data: sales, error } = useSales();

  return (
    <List isLoading={isLoading}>
      {!isLoading && !sales.length && !error ? (
        <List.EmptyView
          icon="no-sales.webp"
          title="Manage all of your sales in one place."
          description="Every time a new customer purchases a product from your Gumroad, their email address and other details are added here."
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                icon="gumroad.png"
                title="Start Selling Today"
                url="https://app.gumroad.com/products/new"
              />
            </ActionPanel>
          }
        />
      ) : (
        sales.map((sale) => (
          <List.Item
            key={sale.id}
            title={sale.order_id.toString()}
            subtitle={sale.product_name}
            accessories={[{ text: sale.timestamp }]}
          />
        ))
      )}
    </List>
  );
}
