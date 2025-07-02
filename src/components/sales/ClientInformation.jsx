"use client";

import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";

const ClientInformation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Client Information
        </h3>
        <p className="text-gray-600">Enter the buyer's details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            {...register("clientName", { required: "Client name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Full name of the client"
          />
          {errors.clientName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientName.message}
            </p>
          )}
        </div>

        {/* Client Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              +216
            </span>
            <input
              type="text"
              {...register("clientPhone", {
                required: "Phone number is required",
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Client phone number"
            />
          </div>
          {errors.clientPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientPhone.message}
            </p>
          )}
        </div>

        {/* Client Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("clientEmail")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="client@example.com"
          />
        </div>

        {/* Buy Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buy Type
          </label>
          <select
            {...register("buyType")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="cash">Cash</option>
            <option value="loan">Loan</option>
          </select>
        </div>
      </div>

      {/* Client Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Note
        </label>
        <textarea
          {...register("clientNote")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Additional notes about the client..."
        />
      </div>
    </div>
  );
};

export default ClientInformation;
