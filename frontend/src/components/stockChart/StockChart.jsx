import './styles.css';
import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const StockChart = ({ dateFilter }) => {
  const [initialLoad, setInitialLoad] = useState(false);

  const { stockChartData: data, stockChartDateFilter } = useSelector(
    (state) => state.stockData
  );

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

  // Calculates the range between each tick in the chatrt
  const calculateTicks = () => {
    let interval = 5;
    if (Math.abs(high.open - low.open) >= 50) {
      interval = 50;
    } else if (Math.abs(high.open - low.open) >= 20) {
      interval = 10;
    } else if (Math.abs(high.open - low.open) >= 10) {
      interval = 5;
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

  // Sets the date in the right format for each time-frame
  const setDates = () => {
    const dates = [];
    const uniqueObjects = data.reduce((acc, curr) => {
      const existingObject = acc.find(
        (obj) => obj.date.split(' ')[0] === curr.date.split(' ')[0]
      );
      if (!existingObject) {
        acc.push(curr);
      }
      return acc;
    }, []);

    uniqueObjects.forEach((obj) => {
      if (dateFilter === '5d') {
        dates.push(obj.date);
      } else if (dateFilter === '1m' && moment(obj.date).date() % 7 === 0) {
        dates.push(obj.date);
      } else {
        const yearMonth = obj.date.substr(0, 7);
        if (!dates.some((date) => date.startsWith(yearMonth))) {
          dates.push(obj.date);
        }
      }
    });

    return dates;
  };

  // Format the date format for each time frame
  const formatDateForUI = (dateString) => {
    if (dateFilter === '6m') {
      return moment(dateString).format('MMM YY');
    } else {
      return moment(dateString).format('Do MMM');
    }
  };

  // Formats the tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='tooltip-container'>
          <p className='semi-bold xs'>{`${payload[0].value.toFixed(2)} USD`}</p>
          {dateFilter === '5d' ? (
            <p className='light xs'>{moment(label).format('Do MMM HH:mm')}</p>
          ) : (
            <p className='light xs'>{moment(label).format('Do MMM')}</p>
          )}
        </div>
      );
    }

    return null;
  };
  return (
    <AreaChart
      width={600}
      height={180}
      data={data}
      margin={{
        left: -20,
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
        style={{ fontSize: '11px' }}
        ticks={setDates()}
        tickFormatter={formatDateForUI}
      />
      <YAxis
        tickLine={false}
        style={{ fontSize: '11px' }}
        axisLine={{ strokeWidth: '0' }}
        ticks={calculateTicks()}
        domain={[Math.floor(low.open), Math.ceil(high.open)]}
        fill='url(#stockPrice)'
      />
      <Tooltip content={<CustomTooltip />} />
      <CartesianGrid vertical={false} />
      <Area
        type='linear'
        dataKey='open'
        stroke={'#A3B18A'}
        fillOpacity={1}
        fill='url(#stockPrice)'
        strokeWidth={2}
      />
    </AreaChart>
  );
};

export default StockChart;
