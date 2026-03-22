import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "../types";

export default function CartItem({ item, onAdd, onRemove, onClear }: { item: CartItemType, onAdd: () => void, onRemove: () => void, onClear: () => void }) {
  return (
    <Card className="mb-3 border-0 shadow-sm overflow-hidden cart-item-card">
      <Row className="g-0 align-items-center">
        <Col xs={3}>
          <Card.Img src={item.image} className="object-fit-cover h-100" style={{ height: "100px" }} />
        </Col>
        <Col xs={9}>
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <Card.Title className="fw-bold fs-6 mb-0">{item.name}</Card.Title>
              <Badge bg="light" text="dark" className="fs-6 fw-bold border shadow-sm">
                ${(item.price * item.quantity).toFixed(2)}
              </Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center bg-light rounded-pill p-1 border shadow-sm">
                  <Button variant="white" size="sm" onClick={onRemove} className="rounded-circle p-1 border-0 shadow-none">
                    <Minus size={14} />
                  </Button>
                  <span className="px-3 fw-bold small">{item.quantity}</span>
                  <Button variant="white" size="sm" onClick={onAdd} className="rounded-circle p-1 border-0 shadow-none">
                    <Plus size={14} />
                  </Button>
                </div>
                <Button variant="outline-danger" size="sm" onClick={onClear} className="rounded-circle p-2 border-0 shadow-none">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}
