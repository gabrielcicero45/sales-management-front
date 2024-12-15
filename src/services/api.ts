import axios from "axios";
import { Product, Sale, SaleProduct, SalesProductDemand } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error);
    return Promise.reject(error);
  }
);

export const fetchSales = async (): Promise<Sale[]> => {
  const response = await api.get("/sales");
  return response.data;
};


export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data;
};

export const fetchProductsSales = async (): Promise<SalesProductDemand[]> => {
  const response = await api.get("/sales/product-sales");
  return response.data;
};

export const createSale = async (selectedProducts: SaleProduct[]) => {
  if (selectedProducts.length === 0) {
    throw new Error("Adicione pelo menos um produto à venda.");
  }

  const payload = {
    products: selectedProducts,
  };

  const response = await api.post("/sales", payload);
  return response.data;
};
