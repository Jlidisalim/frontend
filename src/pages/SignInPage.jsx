import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center space-x-3">
          {/* You can place your logo here */}
          <span className="text-3xl font-bold text-blue-600">
            Horizon Immobilier
          </span>
        </Link>
        <p className="text-gray-600 mt-2">
          Welcome back! Please sign in to continue.
        </p>
      </div>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
