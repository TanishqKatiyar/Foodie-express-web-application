import { Card, Button, Row, Col, Badge } from "react-bootstrap";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { MenuItem as MenuItemType } from "../types";

export default function MenuItem({ item, onAdd, onRemove, quantity }: { item: MenuItemType, onAdd: () => void, onRemove: () => void, quantity: number }) {
  return (
    <Card className="mb-4 border-0 shadow-sm overflow-hidden menu-item-card">
      <Row className="g-0 align-items-center">
        <Col md={4}>
          <Card.Img src={item.image} className="object-fit-cover h-100" style={{ height: "180px" }} />
        </Col>
        <Col md={8}>
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <Card.Title className="fw-bold fs-5 mb-0">{item.name}</Card.Title>
              <Badge bg="light" text="dark" className="fs-6 fw-bold border shadow-sm">
                ${item.price.toFixed(2)}
              </Badge>
            </div>
            <Card.Text className="text-muted small mb-4">
              {item.description}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                {quantity > 0 ? (
                  <div className="d-flex align-items-center bg-light rounded-pill p-1 border shadow-sm">
                    <Button variant="white" size="sm" onClick={onRemove} className="rounded-circle p-1 border-0 shadow-none">
                      <Minus size={16} />
                    </Button>
                    <span className="px-3 fw-bold">{quantity}</span>
                    <Button variant="white" size="sm" onClick={onAdd} className="rounded-circle p-1 border-0 shadow-none">
                      <Plus size={16} />
                    </Button>
                  </div>
                ) : (
                  <Button variant="primary" className="rounded-pill px-4 fw-bold d-flex align-items-center" onClick={onAdd}>
                    <Plus size={18} className="me-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
              {quantity > 0 && (
                <Badge bg="success" pill className="px-3 py-2">
                  Added to Cart
                </Badge>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}
