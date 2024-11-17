import React from 'react';

const WebTrafficWidget = ({ trafficData }) => {
  return (
    <div className="widget">
      <h3>Web Traffic</h3>
      <p>{trafficData} Visitors</p>
    </div>
  );
};

export default WebTrafficWidget;
