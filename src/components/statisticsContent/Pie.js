import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Pie({ width = 400, height = 200, data = [] }) {
  return (
    <PieChart
      series={[
        {
          data: data.length > 0 ? data : [
            { id: 0, value: 100, label: 'series A', color: '#bee9e8' },
            { id: 1, value: 15, label: 'series B', color: '#62b6cb' },
            { id: 2, value: 20, label: 'series C', color: '#1b4965' },
          ],
        },
      ]}
      width={width}
      height={height}
    />
  );
}
