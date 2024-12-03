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
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);  // Track selected product
  const [showQR, setShowQR] = useState(false);  // State to manage showing the QR code

  const username = localStorage.getItem('name');
  const p_team = localStorage.getItem('assignedTeam');

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
        .get('https://ipl-back-1x76.vercel.app/teamassigned', { params: { username } })
        .then((response) => {
          const { team, color, logo } = response.data;
          setTeamDetails({ team, color, logo });
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

  // Fetch products based on team
  useEffect(() => {
    if (p_team) {
      axios
        .get('http://localhost:3001/product_listing', { params: { Team: p_team } })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }
  }, [p_team]);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);  // Save selected product
    setShowQR(true);  // Show QR code and "Pay Here" text
  };

  const handleReturnClick = () => {
    setShowQR(false);  // Hide QR code and return to T-shirt view
  };

  return (
    <div style={backgroundStyle} className="min-h-screen p-4">
      {/* Welcome Section */}
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md mx-auto p-8 reveal"
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
                style={{ maxWidth: '200px' }}
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

      {/* Products Section */}
      <div className="mt-10 max-w-5xl mx-auto">
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: teamDetails.color || '#333' }}
        >
          Products
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4 reveal"
                style={{
                  border: `2px solid ${teamDetails.color || '#ccc'}`,
                  boxShadow: `0 0 10px ${teamDetails.color || '#000'}`,
                }}
              >
                {showQR && selectedProduct && selectedProduct._id === product._id ? (
                  // If "Buy Now" is clicked, show QR code
                  <div className="text-center">
                    <img
                      src="https://www.researchgate.net/publication/350292464/figure/fig2/AS:1022461860671488@1620785312175/Representational-QR-code-with-the-Hello-World-message-embedded.png"
                      alt="QR Code"
                      className="mx-auto"
                      style={{ maxWidth: '200px' }}
                    />
                    <p className="text-xl font-medium mt-4">Pay Here</p>
                    <p className="text-lg mt-2">
                      You are about to buy <strong>{selectedProduct.P_name}</strong> for ₹{selectedProduct.P_price}
                    </p>
                    <button
                      onClick={handleReturnClick}
                      className="mt-6 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      Return to Product
                    </button>
                  </div>
                ) : (
                  // Display T-shirt image before clicking "Buy Now"
                  <>
                    <img
                      src={product.P_url}
                      alt={product.P_name}
                      className="h-40 w-full object-cover rounded-t-lg"
                    />
                    <div className="p-2">
                      <h3 className="text-lg font-semibold text-center">{product.P_name}</h3>
                      <p className="text-md text-gray-600 text-center">Price: ₹{product.P_price}</p>
                      <button
                        onClick={() => handleBuyClick(product)}
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">
            No products available for your team.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
