import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBarChart({ xAxis = [], series = [], width = 460, height = 300 }) {
  return (
    <BarChart
      xAxis={xAxis}
      series={series}
      width={width}
      height={height}
    />
  );
}
