"use client";

import { useFormContext } from "react-hook-form";
import { FileText, Percent } from "lucide-react";

const SaleDetails = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const mainPrice = watch("mainPrice");
  const percentagePaid = watch("percentagePaid");
  const amountPaid = watch("amountPaid");

  // Auto-calculate amount paid from percentage
  const calculateAmountFromPercentage = () => {
    const main = Number.parseFloat(mainPrice) || 0;
    const percentage = Number.parseFloat(percentagePaid) || 0;
    const amount = (main * percentage) / 100;
    setValue("amountPaid", amount);
    setValue("remainingSaleAmount", main - amount);
  };

  // Auto-calculate percentage from amount
  const calculatePercentageFromAmount = () => {
    const main = Number.parseFloat(mainPrice) || 0;
    const amount = Number.parseFloat(amountPaid) || 0;
    const percentage = main > 0 ? (amount / main) * 100 : 0;
    setValue("percentagePaid", percentage.toFixed(2));
    setValue("remainingSaleAmount", main - amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Sale Details
        </h3>
        <p className="text-gray-600">
          Configure the sale terms and payment details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sale Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sale Status *
          </label>
          <select
            {...register("saleStatus", { required: "Sale status is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="promise">Promise</option>
            <option value="full_sale">Full Sale</option>
            <option value="arboun_only">Arboun Only</option>
          </select>
          {errors.saleStatus && (
            <p className="text-red-500 text-sm mt-1">
              {errors.saleStatus.message}
            </p>
          )}
        </div>

        {/* Signature Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Signature
          </label>
          <input
            type="date"
            {...register("signatureDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Percent className="w-6 h-6 text-green-600 mr-2" />
          <h4 className="text-lg font-semibold text-green-900">
            Payment Information
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Percentage Paid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentage Paid (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register("percentagePaid")}
              onBlur={calculateAmountFromPercentage}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Paid (TND)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("amountPaid")}
              onBlur={calculatePercentageFromAmount}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Remaining Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remaining Amount (TND)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("remainingSaleAmount")}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        {/* Progress Bar */}
        {percentagePaid > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Payment Progress</span>
              <span>{Number.parseFloat(percentagePaid || 0).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    Number.parseFloat(percentagePaid || 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sale Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sale Note
        </label>
        <textarea
          {...register("saleNote")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Optional notes about this sale..."
        />
      </div>
    </div>
  );
};

export default SaleDetails;
