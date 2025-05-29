import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PeopleIcon from "@mui/icons-material/People";
import PageviewIcon from "@mui/icons-material/Pageview";
import PageTitle from "../../components/Typography/PageTitle";
import OrdersTable from "../../components/OrdersTable";
import SelectChatWaiter from "../../components/SelectChatWait/SelectChatWaiter";
import ChartLegend from "../../components/Chart/ChartLegend";
import RoundIcon from "../../components/RoundIcon";

const InfoCard = ({ icon, title, value, color }) => (
  <Card elevation={3} sx={{ display: "flex", alignItems: "center", p: 2 }}>
    <RoundIcon icon={icon} bgColorClass={color} />
    <Box sx={{ ml: 2 }}>
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  </Card>
);

const ChartCard = ({ title, children }) => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="subtitle1" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const Dashboard = () => {
  const theme = useTheme();

  const legendData = [
    { title: "Bông Tai", color: "bg-blue-500" },
    { title: "Nhẫn", color: "bg-teal-500" },
    { title: "Vòng tay", color: "bg-purple-600" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageTitle>Dashboard</PageTitle>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Total clients"
            value="6389"
            color="bg-primary-100 text-primary-600"
            icon={PeopleIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Account balance"
            value="$ 46,760.89"
            color="bg-secondary-100 text-secondary-600"
            icon={TrendingUpIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="New sales"
            value="376"
            color="bg-success-100 text-success-600"
            icon={InsertChartIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Pending contacts"
            value="35"
            color="bg-warning-100 text-warning-600"
            icon={PageviewIcon}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <ChartCard title="Revenue">
            <SelectChatWaiter />
            <ChartLegend legends={legendData} />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard title="Traffic">
            <SelectChatWaiter />
            <ChartLegend legends={legendData} />
          </ChartCard>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <OrdersTable resultsPerPage={10} filter="all" />
      </Box>
    </Box>
  );
};

export default Dashboard;