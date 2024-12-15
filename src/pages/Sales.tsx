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
import { Product, Sale, SaleProduct } from "@/types";
import { createSale, fetchProducts, fetchSales } from "@/services/api";
import ProductCard from "@/components/product-card";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SaleProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        handleSales()
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

  const addProductToSale = (productId: number, quantity: number) => {
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
  };

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
      <Button onClick={() => { navigate("/purchases") }}>Ir para as compras</Button>
      <h2 className="text-xl font-bold mb-4">Vendas</h2>

      <div className=" flex mb-4">
        {products.map((product) => (
          <ProductCard product={product} onAddProduct={addProductToSale}/>
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

      <h3 className="text-lg font-bold mt-4">Histórico de Vendas</h3>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Produtos</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
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
