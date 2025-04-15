import React from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  lineOptions,
  lineLegends,
  realTimeUsersBarLegends,
  realTimeUsersBarOptions,
} from "../../utils/demo/chartsData";
import UsersTable from "../components/UsersTable";
import { Box, Grid, Card, CardContent } from "@mui/material"; // Import MUI components
import PageTitle from "../../components/Typography/PageTitle";
import ChartCard from "../../components/Chart/ChartCard";
import ChartLegend from "../../components/Chart/ChartLegend";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


const Customers = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <PageTitle>Quản lý Khách hàng</PageTitle>

      {/* Grid Layout for Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ChartCard title="User Details">
                <Line {...lineOptions} />
                <ChartLegend legends={lineLegends} />
              </ChartCard>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ChartCard title="Online Visitors">
                <Bar {...realTimeUsersBarOptions} />
                <ChartLegend legends={realTimeUsersBarLegends} />
              </ChartCard>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Box sx={{ mt: 3 }}>
        <UsersTable resultsPerPage={10} />
      </Box>
    </Box>
  );
};

export default Customers;
