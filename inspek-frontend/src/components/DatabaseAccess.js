import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const DatabaseAccess = () => {
    const [data, setData] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('reports');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Wrapping fetchData in useCallback to memoize it
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/${selectedCollection}`);
            // Check if the response data is an array
            if (Array.isArray(response.data)) {
                setData(response.data);
            } else {
                throw new Error(`Unexpected data format: ${JSON.stringify(response.data)}`);
            }
        } catch (err) {
            console.error('Fetch error:', err.message);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCollection]); // Add selectedCollection as a dependency

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Include fetchData as a dependency

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${selectedCollection}/${id}`);
            setData(data.filter((item) => item._id !== id));
        } catch (err) {
            console.error('Delete error:', err.message);
            setError('Failed to delete item.');
        }
    };

    const renderTableColumns = () => {
        if (selectedCollection === 'reports') {
            return (
                <>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Client Name</th>
                    <th>Actions</th>
                </>
            );
        } else if (selectedCollection === 'clients') {
            return (
                <>
                    <th>Client Name</th>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Contact Person</th>
                    <th>Actions</th>
                </>
            );
        }
    };

    const renderTableRows = () => {
        if (selectedCollection === 'reports') {
            return data.map((report) => (
                <tr key={report._id}>
                    <td>{report.title || 'N/A'}</td>
                    <td>{report.description || 'N/A'}</td>
                    <td>{report.status || 'N/A'}</td>
                    <td>{report.clientInfo?.clientName || 'Unknown'}</td>
                    <td>
                        <button onClick={() => alert(JSON.stringify(report, null, 2))}>View Details</button>
                        <button onClick={() => handleDelete(report._id)}>Delete</button>
                    </td>
                </tr>
            ));
        } else if (selectedCollection === 'clients') {
            return data.map((client) => (
                <tr key={client._id}>
                    <td>{client.clientName || 'N/A'}</td>
                    <td>{client.companyName || 'N/A'}</td>
                    <td>{client.email || 'N/A'}</td>
                    <td>{client.phoneNumber || 'N/A'}</td>
                    <td>{client.contactPerson || 'N/A'}</td>
                    <td>
                        <button onClick={() => alert(JSON.stringify(client, null, 2))}>View Details</button>
                        <button onClick={() => handleDelete(client._id)}>Delete</button>
                    </td>
                </tr>
            ));
        }
    };

    return (
        <div>
            <h1>Database Access</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="collection-select">Select Collection:</label>
                <select
                    id="collection-select"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                >
                    <option value="reports">Reports</option>
                    <option value="clients">Clients</option>
                </select>
            </div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : (
                <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                    <thead>
                        <tr>{renderTableColumns()}</tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                </table>
            )}
        </div>
    );
};

export default DatabaseAccess;
