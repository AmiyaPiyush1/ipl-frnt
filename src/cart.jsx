import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollReveal from 'scrollreveal';

const Cart = () => {
  const username = localStorage.getItem("name");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Fetch cart items on loading
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/add_to_cart", {
          params: { Username: username }
        });
        setCartItems(response.data);
        calculateTotalPrice(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();

    
    ScrollReveal().reveal('.reveal', {
      delay: 200,
      duration: 1000,
      distance: '50px',
      origin: 'bottom',
      easing: 'ease-out',
    });
  }, [username]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + parseInt(item.P_price, 10), 0);
    setTotalPrice(total);
  };

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setShowQR(true);
  };

  const handleReturnClick = () => {
    setShowQR(false);
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/add_to_cart`, {
        params: { productId },
      });
      const updatedCartItems = cartItems.filter(item => item._id !== productId);
      setCartItems(updatedCartItems);
      calculateTotalPrice(updatedCartItems);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 reveal">Your Cart</h1>
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg p-6 reveal"
                style={{
                  border: '2px solid #ccc',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                {showQR && selectedProduct && selectedProduct._id === item._id ? (
                  <div className="text-center">
                    <img
                      src="https://www.researchgate.net/publication/350292464/figure/fig2/AS:1022461860671488@1620785312175/Representational-QR-code-with-the-Hello-World-message-embedded.png"
                      alt="QR Code"
                      className="mx-auto"
                      style={{ maxWidth: '200px' }}
                    />
                    <p className="text-lg font-medium mt-4">Pay Here</p>
                    <p className="text-sm mt-2">
                      You are about to buy <strong>{selectedProduct.P_name}</strong> for ₹{selectedProduct.P_price}
                    </p>
                    <button
                      onClick={handleReturnClick}
                      className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      Return to Cart
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={item.P_url}
                      alt={item.P_name}
                      className="h-40 w-full object-cover rounded-t-lg"
                    />
                    <h3 className="text-lg font-semibold text-center mt-4">{item.P_name}</h3>
                    <p className="text-center text-gray-600 mt-2">Price: ₹{item.P_price}</p>
                    <button
                      onClick={() => handleBuyClick(item)}
                      className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Remove from Cart
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">Your cart is empty.</p>
        )}
      </div>
      <div className="mt-10 max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-lg reveal">
        <h2 className="text-2xl font-bold text-center mb-4">Total Price</h2>
        <p className="text-center text-lg text-gray-700">₹{totalPrice}</p>
        {cartItems.length > 0 && (
          <>
            {showQR && selectedProduct && selectedProduct.P_name === "Total Purchase" ? (
              <div className="text-center mt-6">
                <img
                  src="https://www.researchgate.net/publication/350292464/figure/fig2/AS:1022461860671488@1620785312175/Representational-QR-code-with-the-Hello-World-message-embedded.png"
                  alt="QR Code"
                  className="mx-auto"
                  style={{ maxWidth: '200px' }}
                />
                <p className="text-lg font-medium mt-4">Pay Here</p>
                <p className="text-sm mt-2">
                  You are about to buy all items in your cart for ₹{totalPrice}
                </p>
                <button
                  onClick={handleReturnClick}
                  className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Return to Cart
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleBuyClick({ P_name: "Total Purchase", P_price: totalPrice })}
                className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
              >
                Buy All
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
