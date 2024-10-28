import {
  ActionPanel,
  Action,
  Grid,
  Detail,
  Icon,
} from "@raycast/api";
import { useProducts } from "./hooks";
import { Product } from "./types";

export default function Products() {
  const { isLoading, data: products } = useProducts();

  return <Grid isLoading={isLoading} columns={3}>
    {products.map(product => <Grid.Item key={product.id} content={product.thumbnail_url} title={product.name} subtitle={product.formatted_price}
    actions={
      <ActionPanel>
        <Action.Push icon={Icon.Eye} title="View Details" target={<ProductDetails product={product} />} />
        <Action.OpenInBrowser icon={product.thumbnail_url} url={product.short_url} />
      </ActionPanel>
    }
    />)}
  </Grid>
}

function ProductDetails({ product }: { product: Product }) {
  return <Detail markdown={`# ${product.name} \n ${product.description} \n\n ![Preview](${product.preview_url})`} metadata={<Detail.Metadata>
    <Detail.Metadata.Label title="Require Shipping" icon={product.require_shipping ? Icon.Check : Icon.Xmark} />
    {product.url ? <Detail.Metadata.Link title="URL" text={product.url} target={product.url} /> : <Detail.Metadata.Label title="URL" icon={Icon.Minus} />}
    <Detail.Metadata.Label title="Deleted" icon={product.deleted ? Icon.Check : Icon.Xmark} />
    {product.tags.length ? <Detail.Metadata.TagList title="Tags">
      {product.tags.map(tag => <Detail.Metadata.TagList.Item key={tag} text={tag} />)}
    </Detail.Metadata.TagList> : <Detail.Metadata.Label title="Tags" icon={Icon.Minus} />}
    <Detail.Metadata.Label title="Published" icon={product.published ? Icon.Check : Icon.Xmark} />
    <Detail.Metadata.Label title="Is Tiered Membership" icon={product.is_tiered_membership ? Icon.Check : Icon.Xmark} />
    {product.variants.length ? <Detail.Metadata.TagList title="Variants">
      {product.variants.map(variant => <Detail.Metadata.TagList.Item key={variant.title} text={variant.title} />)}
    </Detail.Metadata.TagList> : <Detail.Metadata.Label title="Variants" icon={Icon.Minus} />}
  </Detail.Metadata>} />
}