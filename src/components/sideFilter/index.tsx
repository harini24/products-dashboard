// Filters.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { fetchProductsByCategory } from "../../api";
import { Category, Product } from "../../types";

const Wrapper = styled(Stack)(() => ({
  border: "1px solid black",
}));
const SideFilters = ({
  categories,
  loading,
  btnDisabled,
  setBtnDisabled,
  onRunReport,
  onClear,
  setLoading,
}: {
  loading: boolean;
  btnDisabled: boolean;
  onRunReport: (category: string, products: string[]) => void;
  onClear: () => void;
  setLoading: (bool: any) => void;
  setBtnDisabled: (bool: any) => void;
  categories: Category[];
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      const loadProducts = async () => {
        const products = await fetchProductsByCategory(selectedCategory);
        setProducts(products.products);
      };
      loadProducts();
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e: { target: { value: string } }) => {
    setSelectedCategory(e.target.value as string);
    setSelectedProducts([]);
    setBtnDisabled(false);
  };

  const handleProductChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    setSelectedProducts(value);
    setBtnDisabled(false);
  };

  const handleRunReport = () => {
    onRunReport(selectedCategory, selectedProducts);
  };

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedProducts([]);
    onClear();
  };

  return (
    <Wrapper height="100%" gap={6} padding={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Filters</Typography>
        <Button onClick={handleClear}>Clear</Button>
      </Stack>
      <Stack flex={1} gap={2}>
        <Select
          displayEmpty
          value={selectedCategory}
          onChange={handleCategoryChange}
          renderValue={(selected) => {
            return selected ? selected : "Select Category";
          }}
        >
          {categories.map((category) => (
            <MenuItem key={category.name} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          multiple
          value={selectedProducts}
          onChange={handleProductChange}
          disabled={!selectedCategory}
          renderValue={(selected) => {
            return selected.length > 0
              ? selected.join(", ")
              : "Select Products";
          }}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.title}>
              {product.title}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Button
        variant="contained"
        onClick={handleRunReport}
        disabled={!selectedCategory || loading || btnDisabled}
      >
        Run Report
      </Button>
    </Wrapper>
  );
};

export default SideFilters;
