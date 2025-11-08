import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  User,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import './App.css';
import './index.css';
import CartPage from "./pages/Cartpage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

const API_URL = 'http://localhost:4000/api';

function App() {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/cart`, { productId, quantity: 1 });
      await fetchCart();
      showNotification('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding to cart', 'error');
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        await axios.post(`${API_URL}/cart`, { productId, quantity });
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/cart/${productId}`);
      await fetchCart();
      showNotification('Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <Header
        cartCount={cartCount}
        page={page}
        setPage={setPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {page === 'home' && (
        <HomePage
          products={filteredProducts}
          addToCart={addToCart}
          setPage={setPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          loading={loading}
          showNotification={showNotification}
        />
      )}

      {page === 'cart' && (
        <CartPage
          cart={cart}
          updateCartItem={updateCartItem}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          setPage={setPage}
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage
          cart={cart}
          cartTotal={cartTotal}
          setPage={setPage}
          setCart={setCart}
          fetchCart={fetchCart}
          showNotification={showNotification}
        />
      )}

      <Footer />
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header({ cartCount, page, setPage, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <p>🎉 Diwali Sale - Up to 50% OFF | Free Shipping on orders above ₹999</p>
        </div>
      </div>

      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo" onClick={() => setPage('home')}>
            <span className="logo-text">nexora</span>
            <Sparkles className="logo-icon" />
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a onClick={() => { setPage('home'); setMobileMenuOpen(false); }}>Home</a>
            <a href="#women">Women</a>
            <a href="#men">Men</a>
            <a href="#accessories">Accessories</a>
            <a href="#new">New Arrivals</a>
          </div>

          <div className="nav-actions">
            <button className="icon-btn"><Search size={20} /></button>
            <button className="icon-btn"><Heart size={20} /></button>
            <button className="icon-btn"><User size={20} /></button>
            <button className="icon-btn cart-btn" onClick={() => setPage('cart')}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ---------------- Home Page ---------------- */
function HomePage({ products, addToCart, setPage, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, loading, showNotification }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      title: "THE NEXORA COLLECTION",
      subtitle: "Diwali Special – Festival Vibes",
      bg: "https://images.unsplash.com/photo-1760856269352-d0d5ca6ad3c7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=627"
    },
    {
      title: "NEW ARRIVALS",
      subtitle: "Fresh Styles for the Season",
      bg: "https://images.unsplash.com/photo-1706765779533-6c0210fab380?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170"
    },
    {
      title: "TRENDING NOW",
      subtitle: "Urban Streetwear Energy",
      bg: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'all', name: 'All Products', emoji: '✨' },
    { id: 'women', name: "Women's Wear", emoji: '👗' },
    { id: 'men', name: "Men's Wear", emoji: '👔' },
    { id: 'accessories', name: 'Accessories', emoji: '👜' }
  ];

  return (
    <main className="home-page">
      <section className="hero-banner">
        <div className="banner-slider">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${banner.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            >
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <p className="banner-subtitle">{banner.subtitle}</p>
                <h1 className="banner-title">{banner.title}</h1>
                <button className="cta-btn">SHOP NOW</button>
              </div>
            </div>
          ))}
        </div>
        <div className="banner-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for vibes, styles, moods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-emoji">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>NEW PRODUCT ARRIVALS</h2>
            <p>Curated collections that match your vibe</p>
          </div>

          {loading ? (
            <div className="loading">Loading amazing products...</div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real feedback from happy Nexora customers</p>
          </div>
          <div className="testimonials-grid">
            {[
              {
                name: 'Aarav Sharma',
                text: 'Nexora nails it! Their picks actually match my mood and style.',
                img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop'
              },
              {
                name: 'Riya Kapoor',
                text: 'Smooth shopping and fast checkout. I love how personalized it feels!',
                img: 'https://plus.unsplash.com/premium_photo-1681493353999-a3eea8b95e1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
              },
              {
                name: 'Karan Mehta',
                text: 'Finally, an e-commerce site that gets me. The recommendations are spot on.',
                img: 'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
              }
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-avatar" style={{ marginBottom: 16 }}>
                  <img
                    src={t.img}
                    alt={t.name}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block',
                      margin: '0 auto',
                      border: '2px solid var(--primary-orange)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>
                <div className="testimonial-text">"{t.text}"</div>
                <div className="testimonial-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection showNotification={showNotification} />
    </main>
  );
}

/* ---------------- Product Card ---------------- */
function ProductCard({ product, addToCart }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="product-card">
      <div className="product-image">
        <span className="availability-badge">AVAILABLE</span>
        <button className="wishlist-btn" onClick={() => setLiked(!liked)}>
          <Heart size={20} fill={liked ? '#ff6b35' : 'none'} />
        </button>
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button className="quick-view-btn">Quick View</button>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-rating">{'⭐'.repeat(5)}</div>
        <div className="product-footer">
          <span className="product-price">₹{product.price?.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={() => addToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Contact Section ---------------- */
function ContactSection({ showNotification }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    console.log('Contact form submitted:', formData);
    showNotification('Message sent successfully! We\'ll get back to you soon.');
    
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section style={{ padding: '100px 0', background: '#0a0a0a' }}>
      <div className="container">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '600', 
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Let's talk
            </h2>
            <p style={{ color: '#888', fontSize: '1.05rem' }}>
              We typically respond within 24 hours
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '80px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '32px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #333',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#666'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #333',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#666'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>

              <div style={{ marginBottom: '40px' }}>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #333',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#666'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>

              <button 
                type="submit"
                style={{
                  padding: '14px 32px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Send message
              </button>
            </form>

            <div>
              <div style={{ marginBottom: '48px' }}>
                <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Email
                </p>
                <a href="mailto:hello@nexora.com" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
                  hello@nexora.com
                </a>
              </div>

              <div style={{ marginBottom: '48px' }}>
                <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Phone
                </p>
                <a href="tel:+91 98******" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>
                  +91 98******
                </a>
              </div>

              <div>
                <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Location
                </p>
                <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6' }}>
                  Mumbai, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed:', email);
      setEmail('');
      alert('Thanks for subscribing! 🎉');
    }
  };

  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)', 
      borderTop: '1px solid #1a1a1a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Newsletter Section */}
        <div style={{
          padding: '60px 0',
          borderBottom: '1px solid #1a1a1a',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#fff'
          }}>Stay in the loop</h3>
          <p style={{
            color: '#888',
            marginBottom: '32px',
            fontSize: '1rem'
          }}>Subscribe to get early access to new drops, exclusive deals, and style tips.</p>
          
          <form onSubmit={handleSubscribe} style={{
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '14px 20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            <button
              type="submit"
              style={{
                padding: '14px 32px',
                background: '#ff6b35',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.background = '#ff8c42'}
              onMouseLeave={(e) => e.target.style.background = '#ff6b35'}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div style={{
          padding: '60px 0 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '16px' 
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>nexora</h3>
              <Sparkles size={20} color="#ff6b35" />
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Where Vibes Meet Fashion. Elevate your style with curated collections.
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Instagram', 'Twitter', 'Facebook', 'Pinterest'].map((social) => (
                <a
                  key={social}
                  href="#"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #333',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#ff6b35';
                    e.target.style.color = '#ff6b35';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#333';
                    e.target.style.color = '#888';
                  }}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{ 
              color: '#fff', 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a
                    href="#"
                    style={{
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                    onMouseLeave={(e) => e.target.style.color = '#888'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 style={{ 
              color: '#fff', 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Help</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Contact Us', 'Track Order', 'Returns', 'Shipping Info', 'Size Guide'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a
                    href="#"
                    style={{
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                    onMouseLeave={(e) => e.target.style.color = '#888'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{ 
              color: '#fff', 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['About Us', 'Careers', 'Press', 'Sustainability', 'Privacy Policy'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a
                    href="#"
                    style={{
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                    onMouseLeave={(e) => e.target.style.color = '#888'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          padding: '24px 0',
          borderTop: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
            © 2025 Nexora Fashion. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>We accept:</span>
            {['VISA', 'MC', 'AMEX', 'PayPal'].map((payment) => (
              <span
                key={payment}
                style={{
                  padding: '4px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  color: '#888',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;