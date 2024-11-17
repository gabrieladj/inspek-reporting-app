import React from 'react';

const NewClientsWidget = ({ newClients }) => {
  return (
    <div className="widget">
      <h3>New Clients</h3>
      <p>{newClients}</p>
    </div>
  );
};

export default NewClientsWidget;
