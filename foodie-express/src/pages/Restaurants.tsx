import { Container, Row, Col, Form, InputGroup, Badge } from "react-bootstrap";
import { Search, Filter, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import { Restaurant } from "../types";
import { RestaurantSkeleton } from "../components/Skeleton";
import { CUISINES } from "../constants";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/restaurants");
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let result = restaurants;
    if (searchTerm) {
      result = result.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCuisine !== "All") {
      result = result.filter((r) => r.cuisine === selectedCuisine);
    }
    setFilteredRestaurants(result);
  }, [searchTerm, selectedCuisine, restaurants]);

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="fw-bold mb-4">Explore Restaurants</h1>
        <Row className="gy-4">
          <Col lg={8}>
            <InputGroup className="shadow-sm rounded-pill overflow-hidden bg-white border-0">
              <InputGroup.Text className="bg-white border-0 ps-4"><Search size={20} className="text-muted" /></InputGroup.Text>
              <Form.Control 
                placeholder="Search for restaurants or cuisines..." 
                className="border-0 py-3 shadow-none" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 h-100">
              <MapPin size={20} className="text-primary" />
              <span className="fw-bold text-muted small text-uppercase">Gourmet City, FC 12345</span>
            </div>
          </Col>
        </Row>
      </div>

      <div className="mb-5 overflow-auto d-flex gap-2 pb-2 scrollbar-hide">
        <Badge 
          bg={selectedCuisine === "All" ? "primary" : "white"} 
          text={selectedCuisine === "All" ? "white" : "dark"}
          className={`px-4 py-2 rounded-pill fs-6 fw-normal cursor-pointer border shadow-sm ${selectedCuisine === "All" ? "" : "hover-light"}`}
          onClick={() => setSelectedCuisine("All")}
        >
          All
        </Badge>
        {CUISINES.map((cuisine) => (
          <Badge 
            key={cuisine}
            bg={selectedCuisine === cuisine ? "primary" : "white"} 
            text={selectedCuisine === cuisine ? "white" : "dark"}
            className={`px-4 py-2 rounded-pill fs-6 fw-normal cursor-pointer border shadow-sm ${selectedCuisine === cuisine ? "" : "hover-light"}`}
            onClick={() => setSelectedCuisine(cuisine)}
          >
            {cuisine}
          </Badge>
        ))}
      </div>

      <Row className="gy-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <Col key={idx} lg={3} md={6}>
              <RestaurantSkeleton />
            </Col>
          ))
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Col key={restaurant.id} lg={3} md={6}>
              <RestaurantCard restaurant={restaurant} />
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h3 className="text-muted">No restaurants found matching your criteria.</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
}
