"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  DollarSign,
  Percent,
  FileText,
  Shield,
} from "lucide-react";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    commission: "",
    salaire: "",
    role: "employee",
    status: "active",
    note: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setInitialLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/employees/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Employé non trouvé");
          }
          throw new Error("Erreur lors du chargement de l'employé");
        }

        const result = await response.json();

        if (result.success) {
          const employeeData = result.data;
          // Corrected: Set form data with correct keys from API response
          setFormData({
            nom: employeeData.nom || "",
            prenom: employeeData.prenom || "",
            telephone: employeeData.telephone || "",
            email: employeeData.email || "",
            commission: employeeData.commission_percentage?.toString() || "0",
            salaire: employeeData.salaire?.toString() || "0",
            role: employeeData.role || "employee",
            status: employeeData.statut || "active",
            note: employeeData.note || "",
          });
        } else {
          throw new Error(result.message || "Could not fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        if (window.showToast) {
          window.showToast(
            error.message || "Erreur lors du chargement de l'employé",
            "error"
          );
        }
        if (error.message.includes("non trouvé")) {
          navigate("/employees");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.telephone.trim())
      newErrors.telephone = "Le téléphone est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (formData.commission === "") {
      newErrors.commission = "La commission est requise";
    } else if (
      isNaN(formData.commission) ||
      formData.commission < 0 ||
      formData.commission > 100
    ) {
      newErrors.commission = "La commission doit être entre 0 et 100%";
    }
    if (formData.salaire === "") {
      newErrors.salaire = "Le salaire est requis";
    } else if (isNaN(formData.salaire) || formData.salaire < 0) {
      newErrors.salaire = "Le salaire doit être un nombre positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            commission: Number.parseFloat(formData.commission),
            salaire: Number.parseFloat(formData.salaire),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update employee");
      }

      if (window.showToast) {
        window.showToast("Employé modifié avec succès!", "success");
      }

      navigate("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);

      if (window.showToast) {
        window.showToast(
          error.message || "Erreur lors de la modification de l'employé",
          "error"
        );
      }

      if (error.message.includes("email")) {
        setErrors({ email: "Cette adresse email est déjà utilisée" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'employé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/employees")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Modifier l'Employé
              </h1>
              <p className="text-gray-600">
                Modifiez les informations de {formData.prenom} {formData.nom}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Informations Personnelles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nom de famille"
                />
                {errors.nom && (
                  <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.prenom ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Prénom"
                />
                {errors.prenom && (
                  <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Informations de Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.telephone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+216 XX XXX XXX"
                />
                {errors.telephone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.telephone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="email@exemple.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="w-6 h-6 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Informations Financières
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.commission ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="3.5"
                  />
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.commission && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.commission}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire (DT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salaire"
                  value={formData.salaire}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.salaire ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1200"
                />
                {errors.salaire && (
                  <p className="mt-1 text-sm text-red-600">{errors.salaire}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role and Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Rôle et Statut
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="employee">Employé</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Informations supplémentaires sur l'employé..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {loading ? "Modification en cours..." : "Modifier l'Employé"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
