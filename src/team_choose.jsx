import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import ScrollReveal from "scrollreveal";
import axios from "axios";

const TeamChoose = () => {
  const [city, setCity] = useState("");
  const [color, setColor] = useState("");
  const [battingStyle, setBattingStyle] = useState("");
  const [points, setPoints] = useState(0);
  const [assignedTeam, setAssignedTeam] = useState("");
  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("name");

  const teamMapping = {
    Bangalore: "RCB",
    Chennai: "CSK",
    Mumbai: "MI",
    Kolkata: "KKR",
    Delhi: "DC",
  };

  useEffect(() => {
    ScrollReveal().reveal(".reveal", {
      distance: "50px",
      duration: 800,
      reset: false,
    });
  }, []);

  const formAnimation = useSpring({
    opacity: 1,
    transform: "scale(1)",
    from: { opacity: 0, transform: "scale(0.9)" },
  });

  const handleCitySubmit = (selectedCity) => {
    setCity(selectedCity);
    setPoints(3);
    setStep(2);
  };

  const handleColorSubmit = (selectedColor) => {
    setColor(selectedColor);

    const teamColorMap = {
      RCB: "red",
      CSK: "yellow",
      MI: "blue",
      KKR: "purple",
      DC: "blue",
    };
    const teamName = teamMapping[city];
    const assignedColor = teamColorMap[teamName] || "blue";

    const colorPoints = selectedColor === assignedColor ? 2 : -2;
    setPoints((prev) => prev + colorPoints);
    setStep(3);
  };

  const handleStyleSubmit = (style) => {
    setBattingStyle(style);
    setSelectedStyle(style);

    const teamStyleMap = {
      RCB: "aggressive",
      CSK: "balanced",
      MI: "aggressive",
      KKR: "balanced",
      DC: "aggressive",
    };
    const teamName = teamMapping[city];
    const assignedStyle = teamStyleMap[teamName] || "balanced";

    const stylePoints = style === assignedStyle ? 1 : -1;
    const newPoints = points + stylePoints;

    setPoints(newPoints);

    const randomTeams = Object.values(teamMapping);
    const finalTeam =
      newPoints > 1
        ? teamMapping[city]
        : randomTeams[Math.floor(Math.random() * randomTeams.length)];
    setAssignedTeam(finalTeam);

    localStorage.setItem("assignedTeam", finalTeam);
    setStep(4);
  };

  const navigateToDashboard = async () => {
    try {
      const response = await axios.post("http://localhost:3001/teamassigned", {
        username,
        team: assignedTeam,
      });
      console.log("Team assignment response:", response.data);
      navigate("/Dashboard");
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
