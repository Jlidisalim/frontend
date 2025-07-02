/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your page components
import Preloader from "./components/Preloader";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import PropertyDetails from "./pages/PropertyDetails";
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ClientNotes from "./pages/ClientNotes";
import ClientVisits from "./pages/ClientVisits"; // Added import
import Sales from "./pages/Sales";
import AddSale from "./pages/AddSale";
import EditSale from "./pages/EditSale";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import Dashboard from "./pages/Dashboard"; // Added Dashboard import

// Import auth pages
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AccessDenied from "./pages/AccessDenied";

// Import the new profile checker and route guard
import UserProfileChecker from "./components/UserProfileChecker";
import RouteGuard from "./components/RouteGuard";

import "./index.css";

// This check and constant are correct as they are.
// The issue is likely with the environment variable not being loaded by Vite.
console.log(import.meta.env); // temporaire pour debug
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Simple toast notification system
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {message}
    </div>
  );
};

// Main layout for authenticated users
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto bg-gray-50">
          <RouteGuard>
            <Routes>
              {/* Public routes (accessible to all authenticated users) */}
              <Route path="/" element={<Home />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/properties" element={<Home />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/edit-property/:id" element={<EditProperty />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/add-client" element={<AddClient />} />
              <Route path="/edit-client/:id" element={<EditClient />} />
              <Route path="/client-notes/:id" element={<ClientNotes />} />
              <Route
                path="/client-visits/:id"
                element={<ClientVisits />}
              />{" "}
              {/* Added route */}
              <Route path="/sales" element={<Sales />} />
              <Route path="/add-sale" element={<AddSale />} />
              <Route path="/edit-sale/:id" element={<EditSale />} />
              {/* Admin-only routes - Now properly protected */}
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              {/* Added Dashboard route */}
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/edit-employee/:id" element={<EditEmployee />} />
              <Route
                path="/settings"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      Settings
                    </h1>
                    <p className="text-gray-600">
                      Admin settings page - Coming soon!
                    </p>
                  </div>
                }
              />
              {/* Access denied page */}
              <Route path="/access-denied" element={<AccessDenied />} />
            </Routes>
          </RouteGuard>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  window.showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Shorter preloader time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <UserProfileChecker>
                  <DashboardLayout />
                </UserProfileChecker>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

// Create a wrapper component that has access to navigate
const ClerkProviderWithRouter = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProvider>
  );
};

// Update the main wrapper
const AppWrapper = () => (
  <Router>
    <ClerkProviderWithRouter>
      <App />
    </ClerkProviderWithRouter>
  </Router>
);

export default AppWrapper;
