import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, CreditCard, MapPin, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, addToCart, removeFromCart, clearItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    try {
      // Mock payment API call
      const paymentResponse = await axios.post("/api/payment", { amount: total, cart });
      
      if (paymentResponse.data.success) {
        // Save order to Firestore
        const orderData = {
          userId: user.uid,
          items: cart,
          total: total,
          status: "Preparing",
          createdAt: new Date().toISOString(),
          restaurantId: cart[0].restaurantId,
          transactionId: paymentResponse.data.transactionId,
        };
        
        const docRef = await addDoc(collection(db, "orders"), orderData);
        
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-tracking/${docRef.id}`);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="bg-light rounded-circle p-5 mb-4 shadow-sm">
          <ShoppingBag size={64} className="text-muted" />
        </div>
        <h2 className="fw-bold mb-3">Your cart is empty</h2>
        <p className="text-muted mb-5">Looks like you haven't added anything to your cart yet.</p>
        <Button as={Link as any} to="/restaurants" variant="primary" size="lg" className="px-5 rounded-pill fw-bold shadow">
          Start Ordering
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
        <Link to="/restaurants" className="text-primary text-decoration-none d-flex align-items-center mb-4 fw-bold">
          <ArrowLeft size={20} className="me-2" />
          Continue Shopping
        </Link>
        <h1 className="fw-bold mb-2">My Shopping Cart</h1>
        <p className="text-muted">{cart.length} items in your cart</p>
      </div>

      <Row className="gy-5">
        <Col lg={8}>
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onAdd={() => addToCart(item, item.restaurantId)}
                onRemove={() => removeFromCart(item.id)}
                onClear={() => clearItem(item.id)}
              />
            ))}
          </div>
        </Col>
        
        <Col lg={4}>
          <div className="sticky-top" style={{ top: "100px" }}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between align-items-center mb-3 small">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3 small">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="fw-bold text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3 small">
                  <span className="text-muted">Tax</span>
                  <span className="fw-bold">${(total * 0.08).toFixed(2)}</span>
                </div>
                <hr className="my-4 opacity-25" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-4 text-primary">${(total * 1.08).toFixed(2)}</span>
                </div>
                
                <div className="bg-light rounded-3 p-3 mb-4 border shadow-sm">
                  <div className="d-flex align-items-center mb-2 small fw-bold">
                    <MapPin size={16} className="me-2 text-primary" />
                    Delivery Address
                  </div>
                  <p className="text-muted small mb-0">123 Foodie Street, Gourmet City, FC 12345</p>
                </div>

                <Button 
                  variant="primary" 
                  className="w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} className="me-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>
            
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-light">
              <Card.Body className="p-4 d-flex align-items-center">
                <Clock size={24} className="text-primary me-3" />
                <div>
                  <h6 className="fw-bold mb-1 small">Estimated Delivery</h6>
                  <p className="text-muted small mb-0">25-35 minutes</p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
