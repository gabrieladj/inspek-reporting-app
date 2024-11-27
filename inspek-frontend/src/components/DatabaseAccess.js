import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DatabaseAccess.css'; // Importing the CSS file

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
const ITEMS_PER_PAGE = 15; // Updated items per page

const DatabaseAccess = () => {
    const [data, setData] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('reports');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/${selectedCollection}`);
            if (Array.isArray(response.data)) {
                const sortedData = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setData(sortedData);
            } else {
                throw new Error(`Unexpected data format: ${JSON.stringify(response.data)}`);
            }
        } catch (err) {
            console.error('Fetch error:', err.message);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCollection]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${selectedCollection}/${id}`);
            setData(data.filter((item) => item._id !== id));
        } catch (err) {
            console.error('Delete error:', err.message);
            setError('Failed to delete item.');
        }
    };

    const handleClientClick = (clientId) => {
        navigate(`/client/${clientId}`);
    };

    const renderTableColumns = () => {
        if (selectedCollection === 'reports') {
            return (
                <>
                    <th>Client Name</th>
                    <th>Property Name</th>
                    <th>Title</th>
                    <th>Description</th>
                    {/* <th>Status</th> */}
                    <th>Actions</th>
                </>
            );
        } else if (selectedCollection === 'clients') {
            return (
                <>
                    <th>Client Name</th>
                    <th>Property Representative</th>
                    <th>Property Rep. Email</th>
                    <th>Property Rep. Phone</th>
                    <th>Mailing Address</th>
                    <th>Actions</th>
                </>
            );
        }
    };

    const renderTableRows = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const itemsToShow = data.slice(startIndex, endIndex);

        if (selectedCollection === 'reports') {
            return itemsToShow.map((report) => (
                <tr key={`${report._id}-${report.clientId?._id}`}>
                    <td>{report.clientId?.clientName || 'N/A'}</td>
                    <td>{report.propertyInfo?.propertyName || 'N/A'}</td>
                    <td>{report.title || 'N/A'}</td>
                    <td>{report.description || 'N/A'}</td>
                    {/* <td>{report.status || 'N/A'}</td> */}
                    <td className="action-buttons">
                        <button onClick={() => alert(JSON.stringify(report, null, 2))}>View Details</button>
                        <button onClick={() => handleDelete(report._id)}>Delete</button>
                    </td>
                </tr>
            ));
        } else if (selectedCollection === 'clients') {
            return itemsToShow.map((client) => (
                <tr key={client._id}>
                    <td>{client.clientName || 'N/A'}</td>
                    <td>{client.propertyRepresentativeName || 'N/A'}</td>
                    <td>{client.propertyRepresentativeEmail || 'N/A'}</td>
                    <td>{client.propertyRepresentativePhone || 'N/A'}</td>
                    <td>{client.mailingAddress || 'N/A'}</td>
                    <td className="action-buttons">
                        <button onClick={() => handleClientClick(client._id)}>View Details</button>
                        <button onClick={() => handleDelete(client._id)}>Delete</button>
                    </td>
                </tr>
            ));
        }
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

        if (totalPages <= 1) return null;

        return (
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="database-access">
            <h1>Database Access</h1>
            {error && <p className="error">{error}</p>}
            <div className="collection-select">
                <label htmlFor="collection-select">Select Collection:</label>
                <select
                    id="collection-select"
                    value={selectedCollection}
                    onChange={(e) => {
                        setSelectedCollection(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="reports">Reports</option>
                    <option value="clients">Clients</option>
                </select>
            </div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>{renderTableColumns()}</tr>
                        </thead>
                        <tbody>{renderTableRows()}</tbody>
                    </table>
                    {renderPagination()}
                </>
            )}
        </div>
    );
};

export default DatabaseAccess;
