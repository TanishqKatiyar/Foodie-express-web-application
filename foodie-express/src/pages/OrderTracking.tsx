import { Container, Row, Col, Card, Badge, ProgressBar, Spinner, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Order } from "../types";
import Map from "../components/Map";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "orders", id), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Preparing": return <Package size={40} className="text-warning mb-3" />;
      case "Out for delivery": return <Truck size={40} className="text-info mb-3" />;
      case "Delivered": return <CheckCircle size={40} className="text-success mb-3" />;
      default: return <Clock size={40} className="text-muted mb-3" />;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Preparing": return 33;
      case "Out for delivery": return 66;
      case "Delivered": return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Tracking your order...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-muted">Order not found.</h2>
        <Button as={Link as any} to="/restaurants" variant="primary" className="mt-3 rounded-pill">
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
        <Link to="/orders" className="text-primary text-decoration-none d-flex align-items-center mb-4 fw-bold">
          <ArrowLeft size={20} className="me-2" />
          Back to Orders
        </Link>
        <h1 className="fw-bold mb-2">Order Tracking</h1>
        <p className="text-muted">Order #{order.id.slice(-6).toUpperCase()}</p>
      </div>

      <Row className="gy-5">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
            <Card.Body className="p-5 text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                {getStatusIcon(order.status)}
                <h2 className="fw-bold mb-2">{order.status}</h2>
                <p className="text-muted mb-5">Your order is being processed and will be with you soon.</p>
              </motion.div>
              
              <div className="px-lg-5">
                <ProgressBar now={getStatusProgress(order.status)} variant={order.status === "Delivered" ? "success" : "primary"} className="rounded-pill mb-4" style={{ height: "12px" }} />
                <div className="d-flex justify-content-between text-muted small fw-bold text-uppercase tracking-wider">
                  <span className={order.status === "Preparing" ? "text-primary" : ""}>Preparing</span>
                  <span className={order.status === "Out for delivery" ? "text-primary" : ""}>On the way</span>
                  <span className={order.status === "Delivered" ? "text-success" : ""}>Delivered</span>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <div className="mb-5">
            <Map address={order.items[0]?.restaurantId} />
          </div>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom p-4">
              <h5 className="fw-bold mb-0">Delivery Details</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="gy-4">
                <Col md={6}>
                  <div className="d-flex align-items-start mb-4">
                    <MapPin size={24} className="text-primary me-3 flex-shrink-0" />
                    <div>
                      <h6 className="fw-bold mb-1">Delivery Address</h6>
                      <p className="text-muted small mb-0">123 Foodie Street, Gourmet City, FC 12345</p>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-start mb-4">
                    <Phone size={24} className="text-primary me-3 flex-shrink-0" />
                    <div>
                      <h6 className="fw-bold mb-1">Contact Number</h6>
                      <p className="text-muted small mb-0">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <div className="bg-light rounded-4 p-4 d-flex align-items-center">
                <div className="bg-white rounded-circle p-3 me-4 shadow-sm">
                  <Truck size={32} className="text-primary" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Delivery Partner</h6>
                  <p className="text-muted small mb-0">John Doe is on his way with your order.</p>
                </div>
                <Button variant="primary" className="ms-auto rounded-pill px-4 fw-bold shadow-sm">
                  Call Partner
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: "100px" }}>
            <Card.Header className="bg-white border-bottom p-4">
              <h5 className="fw-bold mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 small">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4 opacity-25" />
              <div className="d-flex justify-content-between align-items-center mb-0">
                <span className="fw-bold">Total Paid</span>
                <span className="fw-bold fs-4 text-primary">${order.total.toFixed(2)}</span>
              </div>
              <p className="text-muted small mt-4 mb-0">
                Placed on {format(new Date(order.createdAt), "MMM dd, yyyy 'at' h:mm a")}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
