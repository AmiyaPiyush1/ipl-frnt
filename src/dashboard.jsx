import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollReveal from 'scrollreveal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [teamDetails, setTeamDetails] = useState({
    team: '',
    color: '',
    logo: '',
  });
  const [error, setError] = useState(''); // Error message for team fetching
  const [products, setProducts] = useState([]); // Store products list
  const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product for QR
  const [showQR, setShowQR] = useState(false); // Control QR code visibility
  const [addedToCart, setAddedToCart] = useState(false); // Show "Added to Cart" message
  const username = localStorage.getItem('name'); // Get username from localStorage
  const p_team = localStorage.getItem('assignedTeam'); // Get assigned team from localStorage

  // Fetch team details after component mounts
  useEffect(() => {
    ScrollReveal().reveal('.reveal', {
      delay: 200,
      duration: 1000,
      distance: '50px',
      origin: 'bottom',
      easing: 'ease-out',
    });

    // Fetch team data from API
    if (username) {
      axios
        .get('https://ipl-back-1x76.vercel.app/teamassigned', { params: { username } })
        .then((response) => {
          const { team, color, logo } = response.data;
          setTeamDetails({ team, color, logo }); // Set team details
        })
        .catch((error) => {
          console.error('Error fetching team:', error);
          setError('Unable to fetch team details.'); // Handle error
        });
    } else {
      setError('No username found in localStorage'); // Handle no username
    }
  }, [username]);

  // Set background color based on team details
  const backgroundStyle = teamDetails.color
    ? { backgroundColor: teamDetails.color }
    : {};

  // Fetch products based on team
  useEffect(() => {
    if (p_team) {
      axios
        .get('https://ipl-back-1x76.vercel.app/product_listing', { params: { Team: p_team } })
        .then((response) => {
          setProducts(response.data); // Set products data
        })
        .catch((error) => {
          console.error('Error fetching products:', error); // Handle error
        });
    }
  }, [p_team]);

  // Handle QR code view on product purchase
  const handleBuyClick = (product) => {
    setSelectedProduct(product); // Set selected product
    setShowQR(true); // Show QR code
  };

  const handleReturnClick = () => {
    setShowQR(false); // Hide QR code
  };

  // Navigate to cart page
  const handleCartRoute = () => {
    navigate('/cart');
  };

  // Add product to cart and show confirmation
  const handleCartClick = async (product) => {
    try {
      await axios.post('https://ipl-back-1x76.vercel.app/add_to_cart', {
        Team: p_team,
        Username: username,
        P_url: product.P_url,
        P_name: product.P_name,
        P_price: product.P_price,
      });
      setAddedToCart(true); // Show "Added to Cart"
      setTimeout(() => setAddedToCart(false), 1500); // Hide message after 1.5 seconds
    } catch (error) {
      console.error('Error saving to cart:', error); // Handle error
    }
  };

  // Navigate to update team page
  const updateRoute = () => {
    navigate("/team_choose");
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('assignedTeam');
    navigate('/login'); // Navigate to login page
  };

  // Get button styles based on team color
  const getButtonStyle = (color) => {
    if (color === 'yellow') {
      return { backgroundColor: '#d4a500', color: 'white' }; // Specific color for yellow
    }
    return { backgroundColor: color, color: 'white' }; // Default color
  };

  return (
    <div style={backgroundStyle} className="min-h-screen p-4">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCartRoute}
            style={getButtonStyle(teamDetails.color)}
            className="py-2 px-4 rounded transition-transform transform hover:scale-105"
          >
            🛒 Cart
          </button>
          <button
            onClick={updateRoute}
            style={getButtonStyle(teamDetails.color)}
            className="py-2 px-4 rounded transition-transform transform hover:scale-105"
          >
            Update Team
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="py-2 px-4 rounded transition-transform transform hover:scale-105"
        >
          ➡️ 
          <strong>Log Out</strong>
        </button>
      </nav>

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
                        style={getButtonStyle(teamDetails.color)}
                        className="w-full mt-4 py-2 rounded"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleCartClick(product)}
                        className="mt-2 w-full py-2 bg-green-500 text-white rounded"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl font-medium">No products available for your team.</p>
        )}
      </div>

    
      {addedToCart && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-lg shadow-xl">
          <p className="text-center font-medium">Added to Cart</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
