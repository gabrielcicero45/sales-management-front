export type Sale = {
  id: number;
  products: SaleProduct[];
  createdAt: string;
};

export type SaleProduct = {
  id: number;
  product: Product;
  saleId: number;
  productId: number;
  quantity: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
};

export type SalesProductDemand = {
  product: Product;
  totalQuantitySold: number;
  totalSales: number;
};
