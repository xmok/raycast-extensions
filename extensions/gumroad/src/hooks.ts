import { getPreferenceValues } from "@raycast/api";
import { getAccessToken, useFetch } from "@raycast/utils";
import { ErrorResponse, Product, Sale, SuccessResponse } from "./types";

const API_URL = "https://api.gumroad.com/v2/";

const generateUrl = (method: string) => {
  const { access_token } = getPreferenceValues<Preferences>();
  if (access_token) return `${API_URL}${method}?access_token=${access_token}`;

  const { token } = getAccessToken();
  return `${API_URL}${method}?access_token=${token}`;
};

const parseResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.headers.get("Content-Type")?.includes("text/html")) {
      const wwwAuth = response.headers.get("Www-Authenticate");
      if (wwwAuth) throw new Error(wwwAuth.split("=").at(-1)?.replaceAll(`"`, ``));
      throw new Error(response.statusText);
    }
    const result = (await response.json()) as ErrorResponse;
    throw new Error(result.message);
  }
  const result = await response.json();
  return result;
};

export const useProducts = () =>
  useFetch(generateUrl("products"), {
    method: "GET",
    parseResponse,
    mapResult(result: SuccessResponse<{ products: Product[] }>) {
      return {
        data: result.products,
      };
    },
    initialData: [],
    failureToastOptions: {
      title: "Error fetching products",
    },
  });

export const useSales = () =>
  useFetch(generateUrl("sales"), {
    method: "GET",
    parseResponse,
    mapResult(result: SuccessResponse<{ sales: Sale[] }>) {
      return {
        data: result.sales,
      };
    },
    initialData: [],
    failureToastOptions: {
      title: "Error fetching sales",
    },
  });
