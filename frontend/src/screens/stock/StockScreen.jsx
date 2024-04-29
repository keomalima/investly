import { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './styles.css';

const StockScreen = () => {
  const [initialLoad, setInitialLoad] = useState(false);
  const data = [
    {
      date: '2024-04-26 15:30:00',
      open: 169.98,
      low: 169.18,
      high: 170.09,
      close: 169.29,
      volume: 5867496,
    },
    {
      date: '2024-04-26 15:00:00',
      open: 170.01,
      low: 169.8601,
      high: 170.11,
      close: 169.99,
      volume: 1888029,
    },
    {
      date: '2024-04-26 14:30:00',
      open: 169.7,
      low: 169.52,
      high: 170.02,
      close: 170.015,
      volume: 2218063,
    },
    {
      date: '2024-04-26 14:00:00',
      open: 169.48,
      low: 169.37,
      high: 169.7,
      close: 169.7,
      volume: 2009734,
    },
    {
      date: '2024-04-26 13:30:00',
      open: 169.88,
      low: 169.37,
      high: 169.89,
      close: 169.475,
      volume: 2408401,
    },
    {
      date: '2024-04-26 13:00:00',
      open: 170.0162,
      low: 169.7601,
      high: 170.1684,
      close: 169.875,
      volume: 1823818,
    },
    {
      date: '2024-04-26 12:30:00',
      open: 170.25,
      low: 169.93,
      high: 170.26,
      close: 170.0173,
      volume: 2328349,
    },
    {
      date: '2024-04-26 12:00:00',
      open: 170.52,
      low: 170.21,
      high: 170.53,
      close: 170.245,
      volume: 2001689,
    },
    {
      date: '2024-04-26 11:30:00',
      open: 170.685,
      low: 170.3832,
      high: 170.92,
      close: 170.52,
      volume: 1909128,
    },
    {
      date: '2024-04-26 11:00:00',
      open: 171.09,
      low: 170.41,
      high: 171.34,
      close: 170.69,
      volume: 2641921,
    },
    {
      date: '2024-04-26 10:30:00',
      open: 170.66,
      low: 170.66,
      high: 171.18,
      close: 171.09,
      volume: 2768676,
    },
    {
      date: '2024-04-26 10:00:00',
      open: 170.11,
      low: 170.03,
      high: 171.06,
      close: 170.66,
      volume: 3396224,
    },
    {
      date: '2024-04-26 09:30:00',
      open: 169.88,
      low: 169.54,
      high: 170.71,
      close: 170.1,
      volume: 5328407,
    },
    {
      date: '2024-04-25 15:30:00',
      open: 169.93,
      low: 169.41,
      high: 170.04,
      close: 169.9,
      volume: 6220909,
    },
    {
      date: '2024-04-25 15:00:00',
      open: 169.56,
      low: 169.5,
      high: 170.035,
      close: 169.935,
      volume: 3466401,
    },
    {
      date: '2024-04-25 14:30:00',
      open: 169.11,
      low: 168.9601,
      high: 169.57,
      close: 169.565,
      volume: 2039370,
    },
    {
      date: '2024-04-25 14:00:00',
      open: 169.56,
      low: 169.12,
      high: 169.7499,
      close: 169.13,
      volume: 2052177,
    },
    {
      date: '2024-04-25 13:30:00',
      open: 169.055,
      low: 168.86,
      high: 169.61,
      close: 169.5501,
      volume: 1994795,
    },
    {
      date: '2024-04-25 13:00:00',
      open: 169.36,
      low: 168.9275,
      high: 169.45,
      close: 169.06,
      volume: 1664974,
    },
    {
      date: '2024-04-25 12:30:00',
      open: 169.1876,
      low: 168.92,
      high: 169.5383,
      close: 169.3599,
      volume: 1932937,
    },
    {
      date: '2024-04-25 12:00:00',
      open: 168.54,
      low: 168.5,
      high: 169.2,
      close: 169.19,
      volume: 2067480,
    },
    {
      date: '2024-04-25 11:30:00',
      open: 168.565,
      low: 168.1511,
      high: 168.58,
      close: 168.55,
      volume: 2179216,
    },
    {
      date: '2024-04-25 11:00:00',
      open: 168.57,
      low: 168.45,
      high: 168.87,
      close: 168.5678,
      volume: 2353428,
    },
    {
      date: '2024-04-25 10:30:00',
      open: 168.91,
      low: 168.52,
      high: 169.0856,
      close: 168.575,
      volume: 2601238,
    },
    {
      date: '2024-04-25 10:00:00',
      open: 169.02,
      low: 168.47,
      high: 169.49,
      close: 168.9175,
      volume: 4087157,
    },
    {
      date: '2024-04-25 09:30:00',
      open: 169.525,
      low: 168.925,
      high: 170.61,
      close: 169.01,
      volume: 8393174,
    },
    {
      date: '2024-04-24 15:30:00',
      open: 169.0541,
      low: 168.62,
      high: 169.3,
      close: 168.95,
      volume: 5580485,
    },
    {
      date: '2024-04-24 15:00:00',
      open: 168.45,
      low: 168.3413,
      high: 169.09,
      close: 169.055,
      volume: 2103194,
    },
    {
      date: '2024-04-24 14:30:00',
      open: 168.75,
      low: 168.28,
      high: 168.755,
      close: 168.45,
      volume: 1692851,
    },
    {
      date: '2024-04-24 14:00:00',
      open: 169.105,
      low: 168.6901,
      high: 169.12,
      close: 168.75,
      volume: 1802533,
    },
    {
      date: '2024-04-24 13:30:00',
      open: 168.47,
      low: 168.46,
      high: 169.29,
      close: 169.1085,
      volume: 2089522,
    },
    {
      date: '2024-04-24 13:00:00',
      open: 168.3599,
      low: 168.25,
      high: 168.64,
      close: 168.4617,
      volume: 1358707,
    },
    {
      date: '2024-04-24 12:30:00',
      open: 168.725,
      low: 168.11,
      high: 168.85,
      close: 168.355,
      volume: 2401606,
    },
    {
      date: '2024-04-24 12:00:00',
      open: 168.5903,
      low: 168.25,
      high: 169.28,
      close: 168.725,
      volume: 3339715,
    },
    {
      date: '2024-04-24 11:30:00',
      open: 167.925,
      low: 167.91,
      high: 168.73,
      close: 168.59,
      volume: 3248689,
    },
    {
      date: '2024-04-24 11:00:00',
      open: 167.72,
      low: 167.715,
      high: 168.19,
      close: 167.92,
      volume: 2526677,
    },
    {
      date: '2024-04-24 10:30:00',
      open: 167.995,
      low: 167.52,
      high: 168.28,
      close: 167.73,
      volume: 2686724,
    },
    {
      date: '2024-04-24 10:00:00',
      open: 167.54,
      low: 167.519,
      high: 168.3,
      close: 167.995,
      volume: 3542779,
    },
    {
      date: '2024-04-24 09:30:00',
      open: 166.54,
      low: 166.21,
      high: 167.93,
      close: 167.53,
      volume: 5829662,
    },
    {
      date: '2024-04-23 15:30:00',
      open: 166.84,
      low: 166.755,
      high: 167.05,
      close: 166.91,
      volume: 5718769,
    },
    {
      date: '2024-04-23 15:00:00',
      open: 166.78,
      low: 166.5,
      high: 166.8699,
      close: 166.84,
      volume: 2011867,
    },
    {
      date: '2024-04-23 14:30:00',
      open: 166.84,
      low: 166.66,
      high: 166.8668,
      close: 166.78,
      volume: 1646883,
    },
    {
      date: '2024-04-23 14:00:00',
      open: 166.76,
      low: 166.67,
      high: 166.86,
      close: 166.84,
      volume: 1408245,
    },
    {
      date: '2024-04-23 13:30:00',
      open: 166.395,
      low: 166.325,
      high: 166.77,
      close: 166.75,
      volume: 1441282,
    },
    {
      date: '2024-04-23 13:00:00',
      open: 166.4599,
      low: 166.17,
      high: 166.63,
      close: 166.392,
      volume: 1874189,
    },
    {
      date: '2024-04-23 12:30:00',
      open: 166.27,
      low: 166.22,
      high: 166.64,
      close: 166.453,
      volume: 2194454,
    },
    {
      date: '2024-04-23 12:00:00',
      open: 166.36,
      low: 166.0574,
      high: 166.39,
      close: 166.27,
      volume: 1833476,
    },
    {
      date: '2024-04-23 11:30:00',
      open: 166.62,
      low: 166.245,
      high: 166.7,
      close: 166.359,
      volume: 1993066,
    },
    {
      date: '2024-04-23 11:00:00',
      open: 166.55,
      low: 166.36,
      high: 166.98,
      close: 166.625,
      volume: 3168379,
    },
    {
      date: '2024-04-23 10:30:00',
      open: 165.82,
      low: 165.82,
      high: 166.63,
      close: 166.54,
      volume: 2950840,
    },
    {
      date: '2024-04-23 10:00:00',
      open: 166.12,
      low: 165.62,
      high: 166.71,
      close: 165.82,
      volume: 4802178,
    },
    {
      date: '2024-04-23 09:30:00',
      open: 165.35,
      low: 164.92,
      high: 166.58,
      close: 166.16,
      volume: 5548762,
    },
  ];

  const low = data.reduce((lowest, item) => {
    return lowest.open < (item.open || 0) ? lowest : item;
  }, {});

  const high = data.reduce((highest, item) => {
    return (highest.open || 0) > item.open ? highest : item;
  }, {});

  const chartColor = () => {
    if (data[0].open > data[data.length - 1].open) {
      return '#A3B18A';
    } else {
      return '#C84444';
    }
  };

  const calculateTicks = () => {
    let interval = 5;
    if (Math.abs(high.open - low.open) >= 50) {
      interval = 50;
    } else if (Math.abs(high.open - low.open) >= 10) {
      interval = 10;
    } else {
      interval = 3;
    }
    const ticks = [];
    for (
      let tick = Math.floor(low.open);
      tick <= Math.ceil(high.open);
      tick += interval
    ) {
      ticks.push(tick);
    }
    return ticks;
  };

  return (
    <AreaChart
      width={700}
      height={300}
      data={data}
      margin={{
        top: 15,
        right: 25,
        left: 20,
        bottom: 5,
      }}
    >
      <defs>
        <linearGradient id='stockPrice' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='1%' stopColor={chartColor()} stopOpacity={0.5} />
          <stop offset='95%' stopColor={chartColor()} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey='date'
        tickLine={false}
        tickMargin={10}
        reversed={true}
        style={{ fontSize: '10px' }}
      />
      <YAxis
        tickLine={false}
        style={{ fontSize: '11px' }}
        axisLine={{ strokeWidth: '0' }}
        ticks={calculateTicks()}
        domain={[Math.floor(low.open), Math.ceil(high.open)]}
        fill='url(#stockPrice)'
      />
      <Tooltip />
      <CartesianGrid vertical={false} />
      <Area
        type='monotone'
        dataKey='open'
        stroke={'#A3B18A'}
        fillOpacity={1}
        fill='url(#stockPrice)'
        strokeWidth={2}
      />
    </AreaChart>
  );
};

export default StockScreen;
