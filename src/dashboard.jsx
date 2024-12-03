import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollReveal from 'scrollreveal';

const Dashboard = () => {
  const [teamDetails, setTeamDetails] = useState({
    team: '',
    color: '',
    logo: '',
  });
  const [error, setError] = useState('');
  const username = localStorage.getItem('name'); // Get username from localStorage

  useEffect(() => {
    // ScrollReveal animation
    ScrollReveal().reveal('.reveal', {
      delay: 200,
      duration: 1000,
      distance: '50px',
      origin: 'bottom',
      easing: 'ease-out',
    });

    if (username) {
      axios
        .get(`https://ipl-back-1x76.vercel.app/teamassigned`, { params: { username } })
        .then((response) => {
          const { team, color, logo } = response.data; // Destructure response data
          setTeamDetails({ team, color, logo }); // Set all team details
        })
        .catch((error) => {
          console.error('Error fetching team:', error);
          setError('Unable to fetch team details.');
        });
    } else {
      setError('No username found in localStorage');
    }
  }, [username]);

  const backgroundStyle = teamDetails.color
    ? { backgroundColor: teamDetails.color }
    : {};

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={backgroundStyle}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 reveal"
        style={{
          border: `4px solid ${teamDetails.color || '#ccc'}`,
          boxShadow: `0 0 20px ${teamDetails.color || '#000'}`,
        }}
      >
        <h1
          className="text-4xl font-extrabold text-center mb-6"
          style={{ color: teamDetails.color || '#333' }}
        >
          Welcome, {username || 'Guest'}
        </h1>

        {error ? (
          <p className="text-red-600 text-center text-lg font-medium">{error}</p>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-semibold mb-4">
              Your Team: {teamDetails.team || 'Not assigned yet'}
            </p>
            {teamDetails.logo && (
              <img
                src={teamDetails.logo}
                alt={`${teamDetails.team} logo`}
                className="mx-auto h-40 w-auto transition-transform transform hover:scale-125"
              />
            )}
            {teamDetails.team && (
              <p
                className="mt-6 text-lg font-medium tracking-wide"
                style={{ color: teamDetails.color || '#555' }}
              >
                Welcome to the {teamDetails.team} Fan Store! Explore exclusive
                merchandise and support your team.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
