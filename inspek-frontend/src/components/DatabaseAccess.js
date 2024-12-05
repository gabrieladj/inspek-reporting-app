import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteReportModal from './DeleteReportModal';
import DeleteClientModal from './DeleteClientModal';
import './DatabaseAccess.css'; // Importing the CSS file
import './ConfirmDeleteModal.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
const ITEMS_PER_PAGE = 15; // Updated items per page

const DatabaseAccess = () => {
    const [data, setData] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('clients');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [clientToDelete, setClientToDelete] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/${selectedCollection}`);
            if (Array.isArray(response.data)) {
                const sortedData = [...response.data].reverse(); // Reverse the array directly
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

    const openDeleteReportModal = (reportId) => {
        setReportToDelete(reportId);
        setIsReportModalOpen(true);
    };

    const openDeleteClientModal = (clientId) => {
        setClientToDelete(clientId);
        setIsClientModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsReportModalOpen(false);
        setIsClientModalOpen(false);
    };

    const handleDeleteReport = async (reportId) => {
        try {
            await axios.delete(`${API_BASE_URL}/reports/${reportId}`);
            console.log('Report deleted successfully');
            fetchData(); // Refresh data after deletion
            closeDeleteModal();
        } catch (err) {
            console.error('Failed to delete report:', err);
        }
    };
    

    const handleDeleteClient = async (clientId) => {
        try {
            await axios.delete(`${API_BASE_URL}/clients/${clientId}`);
            console.log('Client and associated reports deleted successfully');
            fetchData(); // Refresh data after deletion
            closeDeleteModal();
        } catch (err) {
            console.error('Failed to delete client:', err);
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

    const handleReportClick = (reportId) => {
        console.log("Navigating to report with ID:", reportId); // Debugging line
        navigate(`/report/${reportId}`); // This should navigate to the correct page
    };

    const renderTableRows = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const itemsToShow = data.slice(startIndex, endIndex);

        if (selectedCollection === 'reports') {
            return itemsToShow.map((item) => (
                <tr key={item._id}>
                    <td>{item.clientId?.clientName || 'N/A'}</td>
                    <td>{item.propertyInfo?.propertyName || 'N/A'}</td>
                    <td>{item.title || 'N/A'}</td>
                    <td>{item.description || 'N/A'}</td>
                    <td className="action-buttons">
                        <button onClick={() => handleReportClick(item._id)}>View</button>
                        <button onClick={() => openDeleteReportModal(item._id)}>Delete</button>
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
                        <button onClick={() => handleClientClick(client._id)}>View</button>
                        <button onClick={() => openDeleteClientModal(client._id)}>Delete</button>
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
                            <tr>{renderTableColumns()}</tr>
                        </thead>
                        <tbody>{renderTableRows()}</tbody>
                    </table>
                    {renderPagination()}
                </>
            )}

            {/* Modals for deleting reports and clients */}
            <DeleteReportModal
                isOpen={isReportModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDeleteReport}
                reportId={reportToDelete}
            />
            <DeleteClientModal
                isOpen={isClientModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDeleteClient}
                clientId={clientToDelete}
            />
        </div>
    );
};

export default DatabaseAccess;
