import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate(); // Hook to navigate to other routes after successful signup
  
  // State to manage form data (username and password)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  // State for handling error messages
  const [errorMessage, setErrorMessage] = useState("");
  
  // State for loading spinner while the request is being processed
  const [loading, setLoading] = useState(false);

  // Handles form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;  // Extract name and value from input fields
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update the state with the new value of the changed field
    }));
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Validate that both fields are filled in
    if (!formData.username || !formData.password) {
      alert("Please fill in the credentials");
    } else {
      try {
        setLoading(true); // Set loading to true when request starts
        // Make the POST request to the backend
        const response = await axios.post("https://ipl-back-1x76.vercel.app/user_name", {
          form: formData.username, // Send username and password to the backend
          password: formData.password,
        });
        setLoading(false); // Set loading to false after the request is complete
        localStorage.setItem("name", formData.username); // Store username in localStorage
        console.log("Sign-Up Successful:", formData); // Log the successful signup
        navigate("/team_choose"); // Navigate to the team selection page after signup
      } catch (error) {
        setLoading(false); // Stop loading spinner if there's an error
        if (error.response) {
          alert(`Error: ${error.response.data.error}`); // Show error message if there's a response error
        } else {
          alert(`Error: ${error.message}`); // Show generic error message if the error is unexpected
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        
        {/* Display error message if any */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Username input field */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange} // Call handleChange when the input changes
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your username"
            />
          </div>
          
          {/* Password input field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange} // Call handleChange when the input changes
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit button with loading spinner */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={loading} // Disable button if loading
              className="w-full p-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {/* Show spinner when loading */}
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                "Sign Up" // Show "Sign Up" text when not loading
              )}
            </button>
          </div>
          
          {/* Link to the Login page if the user already has an account */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-teal-500 hover:text-teal-700 font-semibold"
            >
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
