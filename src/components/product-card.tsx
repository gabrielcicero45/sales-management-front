import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const ProductCard = ({ product, onAddProduct }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddProduct = () => {
    onAddProduct(product.id, quantity);
    setQuantity(0);
  };

  return (
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
        onClick={handleAddProduct}
        className="my-4"
      >
        Adicionar Produto
      </Button>
    </Card>
  );
};

export default ProductCard;