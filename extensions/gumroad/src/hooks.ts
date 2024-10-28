import { getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { ErrorResponse, Product, SuccessResponse } from "./types";

const { access_token } = getPreferenceValues<Preferences>();
const API_URL = "https://api.gumroad.com/v2/";

const params = new URLSearchParams({ access_token }).toString();

export const useProducts = () => useFetch(API_URL + "products?" + params, {
    method: "GET",
    async parseResponse(response) {
        if (!response.ok) {
            const result = await response.json() as ErrorResponse;
            throw new Error(result.message);
        }
        const result = await response.json();
        return result as SuccessResponse<{ products: Product[] }>;
    },
    mapResult(result) {
        return {
            data: result.products
        }
    },
    initialData: [],
    failureToastOptions: {
        title: "Error fetching products",
    }
})