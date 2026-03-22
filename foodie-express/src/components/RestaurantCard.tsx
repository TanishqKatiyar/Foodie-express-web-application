import { Card, Badge, Button } from "react-bootstrap";
import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Restaurant } from "../types";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden restaurant-card">
      <div className="position-relative">
        <Card.Img variant="top" src={restaurant.image} className="object-fit-cover" style={{ height: "200px" }} />
        {restaurant.featured && (
          <Badge bg="primary" className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">
            Featured
          </Badge>
        )}
      </div>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="fw-bold fs-5 mb-0">{restaurant.name}</Card.Title>
          <div className="d-flex align-items-center bg-success text-white px-2 py-1 rounded small fw-bold">
            <Star size={14} className="me-1 fill-white" />
            {restaurant.rating}
          </div>
        </div>
        <Card.Text className="text-muted small mb-3">
          {restaurant.cuisine} • {restaurant.deliveryTime}
        </Card.Text>
        <div className="d-flex align-items-center text-muted small mb-4">
          <Clock size={16} className="me-2" />
          <span>Fast Delivery</span>
        </div>
        <Button as={Link as any} to={`/restaurant/${restaurant.id}`} variant="outline-primary" className="w-100 rounded-pill fw-bold">
          View Menu
        </Button>
      </Card.Body>
    </Card>
  );
}
