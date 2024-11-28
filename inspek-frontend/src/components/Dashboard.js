import React, { useEffect, useState } from 'react';
import CalendarWidget from './widgets/CalendarWidget';
import RevenueWidget from './widgets/RevenueWidget';
import NewClientsWidget from './widgets/NewClientsWidget';
import WebTrafficWidget from './widgets/WebTrafficWidget';
import OverviewWidget from './widgets/OverviewWidget';

import './Dashboard.css';

// Dynamically get the base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [clients, setClients] = useState(0);
  const [traffic, setTraffic] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard-data`)
      .then(response => response.json())
      .then(data => {
        setRevenue(data.revenue);
        setClients(data.newClients);
        setTraffic(data.webTraffic);
      })
      .catch(error => console.error('Error fetching dashboard data:', error));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-title-container">
        <h2 className="dashboard-title">Welcome to the Dashboard</h2>
      </div>
      <div className="revenue-widget">
        <RevenueWidget totalRevenue={revenue} />
      </div>
      <div className="new-clients-widget">
        <NewClientsWidget newClients={clients} />
      </div>
      <div className="web-traffic-widget">
        <WebTrafficWidget trafficData={traffic} />
      </div>
      <div className="overview-widget">
        <OverviewWidget
          totalRevenue={revenue}
          newClients={clients}
          trafficData={traffic}
        />
      </div>
      <div className="calendar-widget">
        <CalendarWidget />
      </div>
    </div>
  );  
};

export default Dashboard;
