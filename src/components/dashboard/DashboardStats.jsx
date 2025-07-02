import {
  Users,
  Building,
  DollarSign,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  subtitle,
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>

          {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}

          {trend && trendValue !== undefined && (
            <div className="flex items-center">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(trendValue)}% from last month
              </span>
            </div>
          )}
        </div>

        <div
          className={`p-3 rounded-lg ${colorClasses[color]} transition-colors`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Clients"
        value={stats?.totalClients || 0}
        icon={Users}
        trend={stats?.clientsGrowth >= 0 ? "up" : "down"}
        trendValue={stats?.clientsGrowth || 0}
        color="blue"
        loading={loading}
      />
      <StatCard
        title="Total Properties"
        value={stats?.totalProperties || 0}
        icon={Building}
        trend={stats?.propertiesGrowth >= 0 ? "up" : "down"}
        trendValue={stats?.propertiesGrowth || 0}
        color="green"
        loading={loading}
      />
      <StatCard
        title="Total Sales"
        value={`${stats?.totalSales || 0} DT`}
        icon={DollarSign}
        trend={stats?.salesGrowth >= 0 ? "up" : "down"}
        trendValue={stats?.salesGrowth || 0}
        color="purple"
        loading={loading}
      />
      <StatCard
        title="Total Leads"
        value={stats?.totalLeads || 0}
        icon={UserPlus}
        trend={stats?.leadsGrowth >= 0 ? "up" : "down"}
        trendValue={stats?.leadsGrowth || 0}
        color="orange"
        loading={loading}
      />
    </div>
  );
};

export default DashboardStats;
