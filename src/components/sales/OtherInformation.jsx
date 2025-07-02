/* eslint-disable no-unused-vars */
"use client";

import { useFormContext } from "react-hook-form";
import { Settings } from "lucide-react";

const OtherInformation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Other Information
        </h3>
        <p className="text-gray-600">
          Additional details and agent information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Senateur State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senateur State
          </label>
          <select
            {...register("senateurState")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="preparation">Preparation</option>
            <option value="signature">Signature</option>
            <option value="registered">Registered</option>
            <option value="finalized">Finalized</option>
          </select>
        </div>

        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent/Intermediary (Samsar)
          </label>
          <input
            type="text"
            {...register("agentName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Agent name"
          />
        </div>

        {/* Agent Commission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commission % for Samsar
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("agentCommissionPercentage")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Commission Paid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commission Paid
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                {...register("commissionPaid")}
                value="true"
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register("commissionPaid")}
                value="false"
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              No
            </label>
          </div>
        </div>
      </div>

      {/* Property Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes sur Appartement/Maison
        </label>
        <textarea
          {...register("propertyNotes")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Additional notes about the property..."
        />
      </div>
    </div>
  );
};

export default OtherInformation;
