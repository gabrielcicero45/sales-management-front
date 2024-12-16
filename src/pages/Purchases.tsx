import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Product,
  Purchase,
  PurchaseProduct,
  Sale,
  SalesProductDemand,
} from "@/types";
import {
  createPurchase,
  fetchProducts,
  fetchProductsSales,
  fetchPurchases,
  fetchSales,
} from "@/services/api";
import ProductCard from "@/components/product-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const Purchases = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productDemands, setProductDemands] = useState<SalesProductDemand[]>(
    []
  );
  const [selectedProducts, setSelectedProducts] = useState<PurchaseProduct[]>(
    []
  );
  const [selectedSale, setSelectedSale] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        handlePurchases();
        handleProductDemands();
        const data = await fetchProducts();
        const sales = await fetchSales();
        setSales(sales);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  const handleCreatePurchase = async () => {
    try {
      await createPurchase(selectedProducts, selectedSale);
      const updatedPurchases = await fetchPurchases();
      setPurchases(updatedPurchases);
      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
    }
  };

  const addProductToPurchase = (productId: number, quantity: number) => {
    if (!productId || quantity <= 0) {
      alert("Selecione um produto e insira uma quantidade válida.");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newProduct: PurchaseProduct = {
      id: Math.random(),
      productId,
      product,
      purchaseId: 0,
      quantity,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);
  };

  const handleProductDemands = async () => {
    try {
      const productDemandsData = await fetchProductsSales();
      setProductDemands(productDemandsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePurchases = async () => {
    try {
      const purchasesData = await fetchPurchases();
      setPurchases(purchasesData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
        <Button onClick={() => { navigate("/sales") }}>Ir para as vendas</Button>
      <h2 className="text-xl font-bold mb-4">Compras</h2>

      <div className="flex mb-4">
        {products.map((product) => (
          <ProductCard product={product} onAddProduct={addProductToPurchase} />
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Produtos Selecionados</h3>
        <ul className="list-disc pl-4">
          {selectedProducts.map((product) => (
            <li key={product.id}>
              {product.product.name} - {product.quantity}x (
              {product.product.price
                ? `$${product.product.price.toFixed(2)}`
                : "Preço indisponível"}
              )
            </li>
          ))}
        </ul>
        {selectedProducts.length > 0 && (
          <Button variant="default" onClick={handleCreatePurchase}>
            Finalizar Compra
          </Button>
        )}
      </div>

      <h3 className="text-lg font-bold mt-4">Demanda de Produtos</h3>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade Necessária</TableHead>
            <TableHead>Quantidade Restante</TableHead>
            <TableHead>Vendas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productDemands.map((productDemand) => (
            <TableRow key={productDemand.product.id}>
              <TableCell>{productDemand.product.name}</TableCell>
              <TableCell>{productDemand.totalQuantitySold}</TableCell>
              <TableCell>{productDemand.totalQuantityMissing}</TableCell>
              <TableCell>{productDemand.totalSales}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-lg font-bold mt-4">Histórico de Vendas</h3>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Selecionar Id</TableHead>
            <TableHead>Produtos</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="flex align-center">
                <Checkbox
                  checked={selectedSale === sale.id}
                  onCheckedChange={() =>
                    setSelectedSale((prev) =>
                      prev === sale.id ? null : sale.id
                    )
                  }
                />
               <p className="ml-4">{sale.id}</p> 
              </TableCell>
              <TableCell>
                <ul className="list-disc pl-4">
                  {sale.products.map((saleProduct) => (
                    <li key={saleProduct.id}>
                      {saleProduct.product.name} - {saleProduct.quantity}x (
                      {saleProduct.product.price
                        ? `$${saleProduct.product.price.toFixed(2)}`
                        : "Preço indisponível"}
                      )
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-lg font-bold mt-4">Histórico de Compras</h3>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Produtos</TableHead>
            <TableHead>ID da Venda</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>
                <ul className="list-disc pl-4">
                  {purchase.products.map((purchaseProduct) => (
                    <li key={purchaseProduct.id}>
                      {purchaseProduct.product.name} -{" "}
                      {purchaseProduct.quantity}x (
                      {purchaseProduct.product.price
                        ? `$${purchaseProduct.product.price.toFixed(2)}`
                        : "Preço indisponível"}
                      )
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>{purchase.saleId}</TableCell>
              <TableCell>
                {new Date(purchase.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Purchases;
