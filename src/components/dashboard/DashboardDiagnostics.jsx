import { Phone, Eye, TrendingUp } from "lucide-react";

const DiagnosticCard = ({
  title,
  icon: Icon,
  children,
  loading = false,
  iconColor = "blue-600",
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Icon className={`w-5 h-5 text-${iconColor} mr-2`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const DashboardDiagnostics = ({ diagnostics, loading }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Most Active Clients */}
      <DiagnosticCard
        title="Most Active Clients"
        icon={Phone}
        iconColor="blue-600"
        loading={loading}
      >
        <div className="space-y-3">
          {(diagnostics?.mostActiveClients || []).map((client, index) => (
            <div
              key={client.id_client}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{client.full_name}</p>
                <p className="text-sm text-gray-600">{client.phone_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">
                  {client.interaction_count} interactions
                </p>
                <p className="text-xs text-gray-500">
                  Last: {new Date(client.last_call).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DiagnosticCard>

      {/* Most Viewed Properties */}
      <DiagnosticCard
        title="Most Viewed Properties"
        icon={Eye}
        iconColor="green-600"
        loading={loading}
      >
        <div className="space-y-3">
          {(diagnostics?.mostViewedProperties || []).map((property, index) => (
            <div
              key={property.id_overview_property}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {property.property_title_overview}
                </p>
                <p className="text-sm text-gray-600">
                  {property.category} • {property.price} DT
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {property.view_count} views
                </p>
                <p className="text-xs text-gray-500">{property.city}</p>
              </div>
            </div>
          ))}
        </div>
      </DiagnosticCard>

      {/* Conversion Rate */}
      <DiagnosticCard
        title="Conversion Metrics"
        icon={TrendingUp}
        iconColor="purple-600"
        loading={loading}
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {diagnostics?.conversionRate || 0}%
            </p>
            <p className="text-sm text-gray-600">Leads to Sales Conversion</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Leads</span>
              <span className="font-medium">
                {diagnostics?.totalLeads || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Converted Sales</span>
              <span className="font-medium">
                {diagnostics?.convertedSales || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Days to Convert</span>
              <span className="font-medium">
                {diagnostics?.avgDaysToConvert || 0} days
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span
                className={`text-sm font-medium ${
                  (diagnostics?.monthlyTrend || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(diagnostics?.monthlyTrend || 0) >= 0 ? "+" : ""}
                {diagnostics?.monthlyTrend || 0}%
              </span>
            </div>
          </div>
        </div>
      </DiagnosticCard>
    </div>
  );
};

export default DashboardDiagnostics;
