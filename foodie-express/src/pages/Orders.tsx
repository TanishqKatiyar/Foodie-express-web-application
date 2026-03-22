import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types";
import OrderCard from "../components/OrderCard";
import { Link } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <Container className="py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
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
        <h1 className="fw-bold mb-2">My Orders</h1>
        <p className="text-muted">Track and view your order history</p>
      </div>

      {orders.length > 0 ? (
        <Row className="justify-content-center">
          <Col lg={8}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </Col>
        </Row>
      ) : (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle p-5 mb-4 shadow-sm d-inline-flex">
            <ShoppingBag size={64} className="text-muted" />
          </div>
          <h2 className="fw-bold mb-3">No orders yet</h2>
          <p className="text-muted mb-5">You haven't placed any orders yet. Start exploring restaurants!</p>
          <Button as={Link as any} to="/restaurants" variant="primary" size="lg" className="px-5 rounded-pill fw-bold shadow">
            Explore Restaurants
          </Button>
        </div>
      )}
    </Container>
  );
}
