"use client";


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientCard from "../components/clients/ClientCard";
import ClientFilters from "../components/clients/ClientFilters";
import Pagination from "../components/Pagination";
import ScrollToTop from "../components/ScrollToTop";
import { useClients } from "../hooks/use-clients";
import { Loader2, Plus } from "lucide-react";

const Clients = () => {
  const navigate = useNavigate();
  const { clients, loading, searchClients, deleteClient } = useClients();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination logic
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = clients.slice(startIndex, endIndex);

  const handleSearch = (filters) => {
    searchClients(filters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleEdit = (id) => {
    console.log("🔧 Edit client:", id);
    navigate(`/edit-client/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id);
    }
  };

  const handleViewNotes = (id) => {
    navigate(`/client-notes/${id}`);
  };

  const handleViewVisits = (id) => {
    navigate(`/client-visits/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-full flex flex-col w-full pt-16">
      {/* Header */}
      <div className="flex-shrink-0 w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Client Management
              </h1>
              <p className="text-gray-600">
                Manage your property clients and leads
              </p>
            </div>
            <button
              onClick={() => navigate("/add-client")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Client</span>
            </button>
          </div>

          {/* Search Filters */}
          <ClientFilters onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>

      {/* Results Summary */}
      {!loading && clients.length > 0 && (
        <div className="flex-shrink-0 w-full">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {startIndex + 1}-{Math.min(endIndex, clients.length)} of{" "}
                {clients.length} clients
              </p>
              <p>
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clients Grid */}
      <div className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-6 pb-6 h-full">
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <span className="block mt-2 text-gray-600">
                  Loading clients...
                </span>
              </div>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No clients found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search filters
                </p>
                <button
                  onClick={() => navigate("/add-client")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Client
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentClients.map((client) => (
                <ClientCard
                  key={client.id_client}
                  client={client}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewNotes={handleViewNotes}
                  onViewVisits={handleViewVisits}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && clients.length > 0 && (
        <div className="flex-shrink-0 w-full">
          <div className="max-w-6xl mx-auto px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={clients.length}
            />
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
};

export default Clients;
