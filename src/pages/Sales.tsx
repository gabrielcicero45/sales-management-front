import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Product, Sale, SaleProduct, SalesProductDemand } from "@/types";
import { createSale, fetchProducts, fetchProductsSales, fetchSales } from "@/services/api";

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSalesDemand, setProductSalesDemand] = useState<
    SalesProductDemand[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  const handleCreateSale = async () => {
    try {
      await createSale(selectedProducts);
      const updatedSales = await fetchSales();
      setSales(updatedSales);
      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
    }
  };

  const addProductToSale = (productId: number) => {
    if (!productId || quantity <= 0) {
      alert("Selecione um produto e insira uma quantidade válida.");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newProduct: SaleProduct = {
      id: Math.random(),
      productId,
      product,
      saleId: 0,
      quantity,
    };

    setSelectedProducts((prev) => [...prev, newProduct]);
    setQuantity(0);
  };

  const handleSalesProductDemand = async () => {
    try{
        const productSaleDemand = await fetchProductsSales()
        setProductSalesDemand(productSaleDemand);
    }
    catch(error){
        console.error(error);
    }
  }

  const handleSales= async () => {
    try{
        const sales= await fetchSales();
        setSales(sales);
    }
    catch(error){
        console.error(error);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vendas</h2>

      <div className=" flex mb-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4 mx-4">
            {product.name}
            <Input
              className="mr-2 my-4"
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button
              variant="default"
              onClick={() => addProductToSale(product.id)}
              className="my-4"
            >
              Adicionar Produto
            </Button>
          </Card>
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
          <Button variant="default" onClick={handleCreateSale}>
            Finalizar Venda
          </Button>
        )}
      </div>

      <Button onClick={handleSales}>Carregar Vendas</Button>
      <Button onClick={handleSalesProductDemand}>Carregar Demanda</Button>

      <h3 className="text-lg font-bold mt-4">Demanda de Produtos</h3>
      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableCell>Produto</TableCell>
            <TableCell>Quantidade Vendida</TableCell>
            <TableCell>Total de Vendas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productSalesDemand.map((productDemand) => (
            <TableRow key={productDemand.product.id}>
              <TableCell>{productDemand.product.name}</TableCell>
              <TableCell>{productDemand.totalQuantitySold}</TableCell>
              <TableCell>{productDemand.totalSales}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-lg font-bold mt-4">Histórico de Vendas</h3>
      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableCell>Produtos</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
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
    </div>
  );
};

export default Sales;
