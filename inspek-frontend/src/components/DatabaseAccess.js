import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './DatabaseAccess.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
const ITEMS_PER_PAGE = 15;

const DatabaseAccess = () => {
    const [data, setData] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('clients');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false); // State for modal
    const [clientToDelete, setClientToDelete] = useState(null); // State for client ID to delete
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/${selectedCollection}`);
            if (Array.isArray(response.data)) {
                const sortedData = [...response.data].reverse();
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

    const handleDeleteClient = async () => {
        try {
            if (clientToDelete) {
                await axios.delete(`${API_BASE_URL}/clients/${clientToDelete}`);
                setData(data.filter((item) => item._id !== clientToDelete));
                setClientToDelete(null);
                setModalOpen(false); // Close the modal
            }
        } catch (err) {
            console.error('Delete error:', err.message);
            setError('Failed to delete client.');
        }
    };

    const handleDeleteClick = (clientId) => {
        setClientToDelete(clientId);
        setModalOpen(true); // Open the modal
    };

    const renderTableRows = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const itemsToShow = data.slice(startIndex, endIndex);

        if (selectedCollection === 'clients') {
            return itemsToShow.map((client) => (
                <tr key={client._id}>
                    <td>{client.clientName || 'N/A'}</td>
                    <td>{client.propertyRepresentativeName || 'N/A'}</td>
                    <td>{client.propertyRepresentativeEmail || 'N/A'}</td>
                    <td>{client.propertyRepresentativePhone || 'N/A'}</td>
                    <td>{client.mailingAddress || 'N/A'}</td>
                    <td className="action-buttons">
                        <button onClick={() => navigate(`/client/${client._id}`)}>View Details</button>
                        <button onClick={() => handleDeleteClick(client._id)}>Delete</button>
                    </td>
                </tr>
            ));
        }
    };

    return (
        <div className="database-access">
            <h2>Database Access</h2>
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
                    <option value="clients">Clients</option>
                    <option value="reports">Reports</option>
                </select>
            </div>
            {isLoading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                {/* Render appropriate columns */}
                                {selectedCollection === 'clients' ? (
                                    <>
                                        <th>Client Name</th>
                                        <th>Property Representative</th>
                                        <th>Property Rep. Email</th>
                                        <th>Property Rep. Phone</th>
                                        <th>Mailing Address</th>
                                        <th>Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Client Name</th>
                                        <th>Property Name</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>{renderTableRows()}</tbody>
                    </table>
                    {/* Render pagination if needed */}
                    {/* Modal */}
                    <ConfirmDeleteModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onDelete={handleDeleteClient}
                    />
                </>
            )}
        </div>
    );
};

export default DatabaseAccess;
