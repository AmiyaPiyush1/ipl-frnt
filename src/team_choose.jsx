import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import ScrollReveal from "scrollreveal";
import axios from "axios";

const TeamChoose = () => {
  // State variables for city, color, batting style, points, team, and step tracking
  const [city, setCity] = useState("");
  const [color, setColor] = useState("");
  const [battingStyle, setBattingStyle] = useState("");
  const [points, setPoints] = useState(0);
  const [assignedTeam, setAssignedTeam] = useState("");
  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState("");

  // Navigate to other routes
  const navigate = useNavigate();
  const username = localStorage.getItem("name");

  // Team mapping for cities
  const teamMapping = {
    Bangalore: "RCB",
    Chennai: "CSK",
    Mumbai: "MI",
    Kolkata: "KKR",
    Delhi: "DC",
  };

  // Mapping for team colors
  const teamColorMap = {
    RCB: "red",
    CSK: "yellow",
    MI: "blue",
    KKR: "purple",
    DC: "blue",
  };

  // Mapping for team batting styles
  const teamStyleMap = {
    RCB: "aggressive",
    CSK: "balanced",
    MI: "aggressive",
    KKR: "balanced",
    DC: "aggressive",
  };

  // Scroll reveal effect when the component is mounted
  useEffect(() => {
    ScrollReveal().reveal(".reveal", {
      distance: "50px",
      duration: 800,
      reset: false,
    });
  }, []);

  // Form animation for smooth transition
  const formAnimation = useSpring({
    opacity: 1,
    transform: "scale(1)",
    from: { opacity: 0, transform: "scale(0.9)" },
  });

  // Handle city selection and move to next step
  const handleCitySubmit = (selectedCity) => {
    setCity(selectedCity);
    setPoints(3); // Set points for city selection
    setStep(2); // Move to next step
  };

  // Handle color selection and update points
  const handleColorSubmit = (selectedColor) => {
    setColor(selectedColor);

    // Get the team based on the selected city
    const teamName = teamMapping[city];

    // Get the assigned team color
    const assignedColor = teamColorMap[teamName] || "blue";

    // Calculate points based on color match
    const colorPoints = selectedColor === assignedColor ? 2 : -2;
    setPoints((prev) => prev + colorPoints);
    setStep(3); // Move to next step
  };

  // Handle batting style selection and calculate points
  const handleStyleSubmit = (style) => {
    setBattingStyle(style);
    setSelectedStyle(style);

    // Get the team style based on selected city
    const teamName = teamMapping[city];
    const assignedStyle = teamStyleMap[teamName] || "balanced";

    // Calculate points based on style match
    const stylePoints = style === assignedStyle ? 1 : -1;
    const newPoints = points + stylePoints;

    // Decide final team assignment based on points
    const randomTeams = Object.values(teamMapping);
    const finalTeam =
      newPoints > 1
        ? teamMapping[city] // Assign the team based on city
        : randomTeams[Math.floor(Math.random() * randomTeams.length)]; // Randomly assign a team

    setAssignedTeam(finalTeam);
    localStorage.setItem("assignedTeam", finalTeam); // Store assigned team in localStorage
    setStep(4); // Move to final step
  };

  // Handle navigation to dashboard after team assignment
  const navigateToDashboard = async () => {
    try {
      const response = await axios.post("https://ipl-back-1x76.vercel.app/teamassigned", {
        username,
        team: assignedTeam,
      });
      console.log("Team assignment response:", response.data);
      navigate("/Dashboard"); // Navigate to the dashboard
    } catch (error) {
      console.error("Error assigning team:", error.response?.data || error.message);
      alert("Failed to assign team. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <animated.div
        style={formAnimation}
        className="w-11/12 max-w-lg p-6 bg-white rounded-lg shadow-lg reveal"
      >
        {/* Step 1: Choose City */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Your City</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.keys(teamMapping).map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => handleCitySubmit(cityName)}
                  className="w-24 h-10 bg-blue-400 text-white font-semibold rounded-lg hover:scale-105 transform transition"
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Color */}
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Your Favorite Color</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {["red", "yellow", "blue", "purple", "green"].map((colorName) => (
                <button
                  key={colorName}
                  onClick={() => handleColorSubmit(colorName)}
                  className="w-24 h-10 font-semibold rounded-lg hover:scale-105 transform transition"
                  style={{ backgroundColor: colorName, color: "white" }}
                >
                  {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Choose Batting Style */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Your Batting Style</h2>
            <div className="flex justify-center gap-6">
              {["balanced", "aggressive"].map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleSubmit(style)}
                  className={`w-32 h-12 font-semibold rounded-lg ${
                    selectedStyle === style
                      ? "bg-gray-800 text-white"
                      : "bg-gray-400 text-black"
                  } hover:scale-105 transform transition`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Display Assigned Team and Navigate */}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-lg mb-6">
              You have been assigned to <strong>{assignedTeam}</strong>!
            </p>
            <button
              onClick={navigateToDashboard}
              className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:scale-105 transform transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default TeamChoose;
