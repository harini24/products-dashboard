// Dashboard.tsx
import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { Options as HighchartsOptions } from "highcharts";
import { fetchCategories, fetchProductsByCategory } from "../../api";
import SideFilters from "../sideFilter";
import { CircularProgress, Grid, Stack } from "@mui/material";
import { Category } from "../../types";

import noDataToDisplay from 'highcharts/modules/no-data-to-display';
noDataToDisplay(Highcharts);
Highcharts.setOptions({
  lang: {
    noData: "No products available for the selected category."
  }
});
const Dashboard = () => {
  const [chartOptions, setChartOptions] = useState<HighchartsOptions>({});
  const [defaultChartOptions, setDefaultChartOptions] =
    useState<HighchartsOptions>({});
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
  useEffect(() => {
    const loadDefaultChart = async () => {
      setLoading(true);
      const cat = await fetchCategories();
      setCategories(cat);
      const data = await Promise.all(
        cat.map(async (category: any) => {
          const { products } = await fetchProductsByCategory(category.name);
          return { name: category.name, y: products.length };
        })
      );

      const defaultOptions: HighchartsOptions = {
        chart: {
          type: "pie",
        },
        plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: "{point.name}",
              },
            },
          },
        title: {
          text: "Product Categories",
        },
        series: [
          {
            type: "pie",
            name: "Categories",
            data: data,
          },
        ],
      };

      setDefaultChartOptions(defaultOptions);
      setChartOptions(defaultOptions);
      setLoading(false);
    };
    loadDefaultChart();
  }, []);

  const handleRunReport = async (category: string, products: string[]) => {
    setLoading(true);
    const { products: allProducts } = await fetchProductsByCategory(category);

    let filteredProducts = allProducts;
    if (products.length > 0) {
      filteredProducts = allProducts.filter((product) =>
        products.includes(product.title)
      );
    }
    setLoading(false);
    setBtnDisabled(true);

    const reportOptions: HighchartsOptions = {
      chart: {
        type: "column",
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y}$",
          },
        },
      },
      title: {
        text: `Products in ${category} category`,
      },
      xAxis: {
        categories: filteredProducts.map((product) => product.title),
      },
      yAxis: {
        min: 0,
        title: {
          text: category,
        },
      },
      series: [
        {
          type: "column",
          name: "Price",
          data: filteredProducts.map((product) => product.price),
        },
      ],
    };

    setChartOptions(reportOptions);
  };

  const handleClear = () => {
    setChartOptions(defaultChartOptions);
  };

  return (
    <Grid container alignItems="center" spacing={2} height="100%">
      <Grid item xs={3} height="100%">
        <SideFilters
          btnDisabled={btnDisabled}
          loading={loading}
          categories={categories}
          onRunReport={handleRunReport}
          onClear={handleClear}
          setLoading={setLoading}
          setBtnDisabled={setBtnDisabled}
        />
      </Grid>
      <Grid item xs={9}>
        {loading ? (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress size={100} />
          </Stack>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
