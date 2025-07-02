/* eslint-disable no-unused-vars */
"use client";

import { useFormContext } from "react-hook-form";
import {
  Home,
  DollarSign,
  FileText,
  Tag,
  User,
  Phone,
  Star,
} from "lucide-react";

const PropertyOverview = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const listingType = watch("listingType");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Property Overview
        </h2>
        <p className="text-gray-600">
          Let's start with the basic information about your property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Title */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4" />
            <span>Property Title *</span>
          </label>
          <input
            type="text"
            {...register("propertyTitle", {
              required: "Property title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter property title"
          />
          {errors.propertyTitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.propertyTitle.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4" />
            <span>Category *</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select Category</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="duplex">Duplex</option>
            <option value="penthouse">Penthouse</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Listing Type */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            <span>Listing Type *</span>
          </label>
          <select
            {...register("listingType", {
              required: "Listing type is required",
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select Type</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="lease">For Lease</option>
          </select>
          {errors.listingType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.listingType.message}
            </p>
          )}
        </div>

        {/* État de l'appartement */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4" />
            <span>État de l'appartement *</span>
          </label>
          <select
            {...register("apartmentState", {
              required: "L'état de l'appartement est requis",
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Sélectionner l'état</option>
            <option value="excellent">Excellent</option>
            <option value="tres-bon">Très bon</option>
            <option value="bon">Bon</option>
            <option value="moyen">Moyen</option>
            <option value="a-renover">À rénover</option>
            <option value="neuf">Neuf</option>
            <option value="en-construction">En construction</option>
          </select>
          {errors.apartmentState && (
            <p className="mt-1 text-sm text-red-600">
              {errors.apartmentState.message}
            </p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            <span>Nom du propriétaire *</span>
          </label>
          <input
            type="text"
            {...register("ownerName", {
              required: "Le nom du propriétaire est requis",
              minLength: {
                value: 2,
                message: "Le nom doit contenir au moins 2 caractères",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Nom complet du propriétaire"
          />
          {errors.ownerName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.ownerName.message}
            </p>
          )}
        </div>

        {/* Owner Phone */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            <span>Numéro de téléphone *</span>
          </label>
          <input
            type="tel"
            {...register("ownerPhone", {
              required: "Le numéro de téléphone est requis",
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Format de numéro invalide",
              },
              minLength: {
                value: 8,
                message: "Le numéro doit contenir au moins 8 chiffres",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="+216 XX XXX XXX"
          />
          {errors.ownerPhone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.ownerPhone.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Prix principal (TND) *</span>
          </label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="0"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Prix minimum (TND)</span>
          </label>
          <input
            type="number"
            {...register("priceMin", {
              min: { value: 0, message: "Le prix minimum doit être positif" },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Prix minimum négociable"
          />
          {errors.priceMin && (
            <p className="mt-1 text-sm text-red-600">
              {errors.priceMin.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Prix maximum (TND)</span>
          </label>
          <input
            type="number"
            {...register("priceMax", {
              min: { value: 0, message: "Le prix maximum doit être positif" },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Prix maximum négociable"
          />
          {errors.priceMax && (
            <p className="mt-1 text-sm text-red-600">
              {errors.priceMax.message}
            </p>
          )}
        </div>

        {/* Tax Rate */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Tax Rate (%)</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("taxRate", {
              min: { value: 0, message: "Tax rate must be positive" },
              max: { value: 100, message: "Tax rate cannot exceed 100%" },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="0.00"
          />
          {errors.taxRate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.taxRate.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            <span>Description *</span>
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 20,
                message: "Description must be at least 20 characters",
              },
            })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Describe your property in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
