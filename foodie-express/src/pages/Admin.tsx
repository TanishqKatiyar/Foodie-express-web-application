import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Order } from "../types";
import { format } from "date-fns";
import { Edit2, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = () => {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders) as Order[];
        setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
      setLoading(false);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders) as Order[];
        const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update status.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders) as Order[];
        const updatedOrders = allOrders.filter(o => o.id !== orderId);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        toast.success("Order deleted.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete order.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Preparing": return <Badge bg="warning" className="px-3 py-2 rounded-pill">Preparing</Badge>;
      case "Out for delivery": return <Badge bg="info" className="px-3 py-2 rounded-pill">Out for delivery</Badge>;
      case "Delivered": return <Badge bg="success" className="px-3 py-2 rounded-pill">Delivered</Badge>;
      default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
    }
  };

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
        <h1 className="fw-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted">Manage orders and restaurant operations</p>
      </div>

      <Row className="gy-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom p-4">
              <h5 className="fw-bold mb-0">Recent Orders</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="p-4 border-0 small text-uppercase fw-bold text-muted">Order ID</th>
                    <th className="p-4 border-0 small text-uppercase fw-bold text-muted">Date</th>
                    <th className="p-4 border-0 small text-uppercase fw-bold text-muted">Customer</th>
                    <th className="p-4 border-0 small text-uppercase fw-bold text-muted">Total</th>
                    <th className="p-4 border-0 small text-uppercase fw-bold text-muted">Status</th>
                    <th className="p-4 border-0 small text-uppercase fw-bold text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-4 fw-bold">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-muted small">{format(new Date(order.createdAt), "MMM dd, yyyy")}</td>
                      <td className="p-4">{order.userId.slice(0, 8)}...</td>
                      <td className="p-4 fw-bold text-primary">${order.total.toFixed(2)}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4">
                        <div className="d-flex gap-2">
                          <Button variant="light" size="sm" className="rounded-circle p-2 border shadow-sm" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                            <Eye size={16} />
                          </Button>
                          <Form.Select 
                            size="sm" 
                            className="rounded-pill px-3 border shadow-sm w-auto" 
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                          >
                            <option value="Preparing">Preparing</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                          </Form.Select>
                          <Button variant="outline-danger" size="sm" className="rounded-circle p-2 border shadow-sm" onClick={() => deleteOrder(order.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 p-4">
          <Modal.Title className="fw-bold">Order Details #{selectedOrder?.id.slice(-6).toUpperCase()}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-0">
          {selectedOrder && (
            <div>
              <div className="mb-4">
                <h6 className="fw-bold mb-3 small text-uppercase tracking-wider text-muted">Items</h6>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4 opacity-25" />
              <div className="d-flex justify-content-between align-items-center mb-0">
                <span className="fw-bold fs-5">Total Amount</span>
                <span className="fw-bold fs-4 text-primary">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
