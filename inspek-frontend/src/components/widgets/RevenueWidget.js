import React from 'react';

const RevenueWidget = ({ totalRevenue }) => {
  return (
    <div className="widget">
      <h3>Total Revenue</h3>
      <p>${totalRevenue}</p>
    </div>
  );
};

export default RevenueWidget;
