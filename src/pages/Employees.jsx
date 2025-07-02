"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Users,
  Shield,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total_employees: 0,
    active_employees: 0,
    admin_count: 0,
    employee_count: 0,
    average_salary: "0.00",
  });
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/employees`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setEmployees(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/employees/stats`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(
          data.data || {
            total_employees: 0,
            active_employees: 0,
            admin_count: 0,
            employee_count: 0,
            average_salary: "0.00",
          }
        );
      }
    } catch (error) {
      console.error("Error fetching employee stats:", error);
    }
  };

  // Search employees with filters
  const searchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/employees/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchTerm,
          role: roleFilter !== "all" ? roleFilter : null,
          statut: statusFilter !== "all" ? statusFilter : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setEmployees(data.data || []);
      } else {
        throw new Error(data.message || "Failed to search employees");
      }
    } catch (error) {
      console.error("Error searching employees:", error);
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      searchEmployees();
    }, 500);
    setSearchTimeout(timeout);
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm, roleFilter, statusFilter]);

  const handleAddEmployee = () => {
    navigate("/add-employee");
  };

  const handleEditEmployee = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  // Corrected: The view action now navigates to the edit page.
  const handleViewEmployee = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        const response = await fetch(`${API_URL}/employees/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setEmployees(employees.filter((emp) => emp.id_employee !== id));
          fetchStats();
          window.showToast &&
            window.showToast("Employé supprimé avec succès", "success");
        } else {
          throw new Error(data.message || "Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        window.showToast &&
          window.showToast(`Erreur: ${error.message}`, "error");
      }
    }
  };

  const handleExportEmployees = () => {
    const headers = [
      "Nom",
      "Prénom",
      "Email",
      "Téléphone",
      "Commission",
      "Salaire",
      "Rôle",
      "Statut",
      "Date d'ajout",
    ];
    const csvContent = [
      headers.join(","),
      ...employees.map((emp) =>
        [
          emp.nom,
          emp.prenom,
          emp.email,
          emp.telephone,
          emp.commission_percentage,
          emp.salaire,
          emp.role,
          emp.statut,
          new Date(emp.date_ajout).toLocaleDateString("fr-FR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `employees_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Shield className="w-4 h-4 text-purple-600" />
    ) : (
      <User className="w-4 h-4 text-blue-600" />
    );
  };

  const getRoleBadge = (role) => {
    return role === "admin" ? (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
        Admin
      </span>
    ) : (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        Employé
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        Actif
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
        Inactif
      </span>
    );
  };

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des Employés
                </h1>
                <p className="text-gray-600">
                  Gérez votre équipe et leurs informations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              <button
                onClick={handleExportEmployees}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel Employé</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Erreur: {error}</span>
            </div>
            <button
              onClick={() => {
                fetchEmployees();
                fetchStats();
              }}
              className="flex items-center space-x-1 text-red-700 hover:text-red-900"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réessayer</span>
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, prénom, email ou téléphone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {showFilters && (
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Employés
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_employees || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active_employees || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.admin_count || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Salaire Moyen
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.average_salary || 0} DT
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des Employés ({employees.length})
            </h2>
          </div>

          {loading && employees.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700 text-sm">
                Mise à jour des données...
              </span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'ajout
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id_employee} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {employee.prenom?.[0] || "?"}
                            {employee.nom?.[0] || "?"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.prenom} {employee.nom}
                          </div>
                          {employee.note && (
                            <div
                              className="text-sm text-gray-500 truncate max-w-xs"
                              title={employee.note}
                            >
                              {employee.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {employee.telephone || "N/A"}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span
                            className="truncate max-w-xs"
                            title={employee.email}
                          >
                            {employee.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.commission_percentage || 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.salaire || 0} DT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(employee.role)}
                        {getRoleBadge(employee.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {employee.date_ajout_formatted ||
                          (employee.date_ajout
                            ? new Date(employee.date_ajout).toLocaleDateString(
                                "fr-FR"
                              )
                            : "N/A")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            handleViewEmployee(employee.id_employee)
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Voir / Modifier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleEditEmployee(employee.id_employee)
                          }
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteEmployee(employee.id_employee)
                          }
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {employees.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun employé trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Aucun employé ne correspond à vos critères de recherche."
                  : "Commencez par ajouter votre premier employé."}
              </p>
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Employé</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
