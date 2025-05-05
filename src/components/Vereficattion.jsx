import { useState } from "react";

const Verification = ({ email, credentials, onVerificationSuccess, onCancel }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First verify the code
      const verifyResponse = await fetch(
        "https://todo-backensd.vercel.app/api/auth/verify-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const verifyResult = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        throw new Error(verifyResult.message || "Verification failed");
      }

      // If verification successful, register the user
      if (credentials) {
        const registerResponse = await fetch(
          "https://todo-backensd.vercel.app/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const registerResult = await registerResponse.json();

        if (!registerResponse.ok) {
          throw new Error(registerResult.message || "Registration failed");
        }

        // Store token in localStorage
        if (registerResult.token) {
          localStorage.setItem("token", registerResult.token);
        }
      }

      // Call success handler
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://todo-backensd.vercel.app/api/auth/send-verification-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      // Show success message
      setError("A new verification code has been sent to your email.");
    } catch (error) {
      console.error("Resend code error:", error);
      setError(error.message || "Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {error && (
          <div className={`p-4 mb-4 rounded-md ${error.includes("sent") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleVerifyCode}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>
          
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
            >
              Resend Code
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="text-sm font-medium text-gray-600 hover:text-gray-500 disabled:opacity-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;