import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Grid, Box, Typography, Select, MenuItem, Button, IconButton,
  Card, CardHeader, CardContent, CardActions, Avatar, Divider
} from '@mui/material';
import {
  Download, Refresh, FilterList, ArrowUpward, ArrowDownward, Equalizer
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Sample data
const barData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const lineData = [
  { name: 'Week 1', value: 4000 },
  { name: 'Week 2', value: 3000 },
  { name: 'Week 3', value: 5000 },
  { name: 'Week 4', value: 2780 },
];

const StatCard = ({ title, value, change, icon, color, direction }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="textSecondary">{title}</Typography>
        <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
      </Box>
      <Typography variant="h5" mt={1}>{value}</Typography>
      <Box display="flex" alignItems="center" mt={1}>
        {direction === 'up' && <ArrowUpward sx={{ fontSize: 16, color }} />}
        {direction === 'down' && <ArrowDownward sx={{ fontSize: 16, color }} />}
        <Typography variant="body2" color={color} ml={0.5}>
          {change}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const DashReports = () => {
  const [timeRange, setTimeRange] = React.useState('monthly');

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold">Network Monitoring Dashboard</Typography>
            <Box display="flex" gap={2}>
              <Select size="small" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
              <Button variant="outlined" startIcon={<Download />}>Export</Button>
              <Button variant="contained" startIcon={<Refresh />}>Refresh</Button>
            </Box>
          </Box>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value="$24,560"
              change="12.5% increase"
              icon={<ArrowUpward />}
              color="#4caf50"
              direction="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="New Users"
              value="1,245"
              change="8.2% increase"
              icon={<Equalizer />}
              color="#2196f3"
              direction="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Sessions"
              value="3,456"
              change="2.3% decrease"
              icon={<Equalizer />}
              color="#f44336"
              direction="down"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Conversion Rate"
              value="3.6%"
              change="1.1% increase"
              icon={<Equalizer />}
              color="#9c27b0"
              direction="up"
            />
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Revenue Overview" action={<IconButton><FilterList /></IconButton>} />
            <Divider />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Traffic Sources" />
            <Divider />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Activity & Trends */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="User Activity" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sales Trend" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashReports;