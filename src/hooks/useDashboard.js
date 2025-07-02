import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "../services/api";

// Custom hook for dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => dashboardAPI.getStats().then((res) => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    cacheTime: 300000, // Keep in cache for 5 minutes
  });
};

// Custom hook for sales data
export const useSalesData = () => {
  return useQuery({
    queryKey: ["salesPerMonth"],
    queryFn: () => dashboardAPI.getSalesPerMonth().then((res) => res.data),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 50000,
  });
};

// Custom hook for property types
export const usePropertyTypes = () => {
  return useQuery({
    queryKey: ["propertyTypes"],
    queryFn: () => dashboardAPI.getPropertyTypes().then((res) => res.data),
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000,
  });
};

// Custom hook for new clients data
export const useNewClientsData = () => {
  return useQuery({
    queryKey: ["newClients"],
    queryFn: () => dashboardAPI.getNewClientsOverTime().then((res) => res.data),
    refetchInterval: 60000,
    staleTime: 50000,
  });
};

// Custom hook for diagnostics
export const useDiagnostics = () => {
  return useQuery({
    queryKey: ["diagnostics"],
    queryFn: () => dashboardAPI.getDiagnostics().then((res) => res.data),
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

// Combined hook for all dashboard data
export const useDashboardData = () => {
  const stats = useDashboardStats();
  const sales = useSalesData();
  const propertyTypes = usePropertyTypes();
  const newClients = useNewClientsData();
  const diagnostics = useDiagnostics();

  return {
    stats,
    sales,
    propertyTypes,
    newClients,
    diagnostics,
    isLoading:
      stats.isLoading ||
      sales.isLoading ||
      propertyTypes.isLoading ||
      newClients.isLoading ||
      diagnostics.isLoading,
    isError:
      stats.isError ||
      sales.isError ||
      propertyTypes.isError ||
      newClients.isError ||
      diagnostics.isError,
  };
};
