type ProductVariant = {
  title: string;
  options: Array<{
    name: string;
    is_pay_what_you_want: boolean;
  }>;
};
export type Product = {
  name: string;
  preview_url: string | null;
  description: string;
  require_shipping: boolean;
  id: string;
  url: string | null;
  short_url: string;
  thumbnail_url: string;
  tags: string[];
  formatted_price: string;
  published: boolean;
  deleted: boolean;
  is_tiered_membership: boolean;
  variants: ProductVariant[];
};

export type Sale = {
  id: string;
  timestamp: string;
  product_name: string;
  order_id: number;
};

export type ErrorResponse = {
  success: false;
  message: string;
};
export type SuccessResponse<T> = {
  success: true;
} & T;
