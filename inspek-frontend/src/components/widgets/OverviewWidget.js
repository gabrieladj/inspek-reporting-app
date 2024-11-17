import React from 'react';

const OverviewWidget = ({ totalRevenue, newClients, trafficData }) => {
  return (
    <div className="widget" style={{ gridColumn: 'span 2' }}>
      <h3>Overview</h3>
      <p>Total Revenue: ${totalRevenue}</p>
      <p>New Clients: {newClients}</p>
      <p>Web Traffic: {trafficData} Visitors</p>
    </div>
  );
};

export default OverviewWidget;
