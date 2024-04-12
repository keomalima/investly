import MetricCard from '../../components/metricCard/MetricCard';
import Navbar from '../../components/navbar/Navbar';
import './styles.css';

const DashboardScreen = () => {
  return (
    <div>
      <Navbar />
      <div className='metrics-container container'>
        <div className='grid-4'>
          <MetricCard />
          <MetricCard />
          <MetricCard />
          <MetricCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
