import { Card, Badge, Row, Col, ProgressBar } from "react-bootstrap";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Order } from "../types";
import { format } from "date-fns";

export default function OrderCard({ order }: { order: Order }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Preparing": return <Package size={20} className="text-warning me-2" />;
      case "Out for delivery": return <Truck size={20} className="text-info me-2" />;
      case "Delivered": return <CheckCircle size={20} className="text-success me-2" />;
      default: return <Clock size={20} className="text-muted me-2" />;
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

  return (
    <Card className="mb-4 border-0 shadow-sm overflow-hidden order-card">
      <Card.Header className="bg-white border-bottom p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">Order #{order.id.slice(-6).toUpperCase()}</h6>
          <Badge bg={order.status === "Delivered" ? "success" : "warning"} pill className="px-3 py-2">
            {order.status}
          </Badge>
        </div>
        <div className="text-muted small">
          Placed on {format(new Date(order.createdAt), "MMM dd, yyyy 'at' h:mm a")}
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            {getStatusIcon(order.status)}
            <span className="fw-bold">{order.status}</span>
          </div>
          <ProgressBar now={getStatusProgress(order.status)} variant={order.status === "Delivered" ? "success" : "primary"} className="rounded-pill" style={{ height: "8px" }} />
        </div>
        
        <div className="mb-4">
          <h6 className="fw-bold mb-3 small text-uppercase tracking-wider text-muted">Items</h6>
          {order.items.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 small">
              <span>{item.quantity}x {item.name}</span>
              <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <hr className="my-3 opacity-25" />
        
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">Total Amount</span>
          <span className="fw-bold fs-5 text-primary">${order.total.toFixed(2)}</span>
        </div>
      </Card.Body>
    </Card>
  );
}
