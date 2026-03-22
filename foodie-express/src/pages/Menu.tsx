import { Container, Row, Col, Badge, Button, Spinner, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowLeft, Info, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import MenuItem from "../components/MenuItem";
import { Restaurant, MenuItem as MenuItemType } from "../types";
import { MenuSkeleton } from "../components/Skeleton";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { GoogleGenAI, Type } from "@google/genai";
import toast from "react-hot-toast";

export default function Menu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingMenu, setFetchingMenu] = useState(false);
  const { cart, addToCart, removeFromCart } = useCart();

  const fetchActualMenu = async (restaurantName: string) => {
    setFetchingMenu(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "undefined") {
        throw new Error("Gemini API key is not configured. Please ensure it is set in your environment variables.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a list of 6-8 popular menu items for the restaurant "${restaurantName}". For each item, provide:
        1. name: The name of the dish.
        2. description: A mouth-watering 1-sentence description.
        3. price: A realistic price in USD (number).
        4. imageKeyword: A highly specific, descriptive food keyword for an image search (e.g., "double-cheeseburger", "pepperoni-pizza-slice", "salmon-nigiri-sushi", "crispy-chicken-tacos"). Avoid generic words like "food" or "dish".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
                imageKeyword: { type: Type.STRING },
              },
              required: ["name", "description", "price", "imageKeyword"],
            },
          },
        },
      });

      const menuData = JSON.parse(response.text);
      const formattedMenu: MenuItemType[] = menuData.map((item: any, index: number) => ({
        id: `ai-menu-${index}`,
        name: item.name,
        description: item.description,
        price: item.price,
        image: `https://loremflickr.com/400/300/${encodeURIComponent(item.imageKeyword || item.name)},food/all`,
      }));

      setRestaurant(prev => prev ? { ...prev, menu: formattedMenu } : null);
      toast.success("Updated menu with actual items!");
    } catch (error: any) {
      console.error("Error fetching actual menu:", error);
      toast.error(error.message || "Failed to fetch actual menu items.");
    } finally {
      setFetchingMenu(false);
    }
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        const data = response.data;
        setRestaurant(data);
        
        // If it's a real restaurant name (not just mock), fetch actual menu
        if (data.name && !data.id.startsWith("nearby-")) {
           // We can still fetch for mock ones to make them "actual"
           fetchActualMenu(data.name);
        } else if (data.id.startsWith("nearby-")) {
           fetchActualMenu(data.name);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="mb-5">
          <div className="bg-light rounded-4 p-5 animate-pulse" style={{ height: "300px" }}></div>
        </div>
        <Row>
          <Col lg={8}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <MenuSkeleton key={idx} />
            ))}
          </Col>
        </Row>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-muted">Restaurant not found.</h2>
        <Button as={Link as any} to="/restaurants" variant="primary" className="mt-3 rounded-pill">
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  return (
    <div className="menu-page">
      {/* Restaurant Header */}
      <section className="bg-dark text-white py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ backgroundImage: `url(${restaurant.image})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
        <Container className="position-relative z-index-1">
          <Link to="/restaurants" className="text-white text-decoration-none d-flex align-items-center mb-4 opacity-75 hover-opacity-100">
            <ArrowLeft size={20} className="me-2" />
            Back to Restaurants
          </Link>
          <Row className="align-items-end">
            <Col lg={8}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="display-4 fw-bold mb-3">{restaurant.name}</h1>
                <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                  <Badge bg="success" className="px-3 py-2 fs-6 d-flex align-items-center rounded-pill">
                    <Star size={16} className="me-2 fill-white" />
                    {restaurant.rating}
                  </Badge>
                  <span className="opacity-75">{restaurant.cuisine} • {restaurant.deliveryTime}</span>
                  <span className="opacity-75 d-flex align-items-center">
                    <MapPin size={16} className="me-2" />
                    Gourmet City, FC 12345
                  </span>
                </div>
              </motion.div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button 
                  variant="light" 
                  className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center"
                  onClick={() => fetchActualMenu(restaurant.name)}
                  disabled={fetchingMenu}
                >
                  {fetchingMenu ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <RefreshCw size={20} className="me-2 text-primary" />
                  )}
                  Refresh Menu
                </Button>
                <Button variant="light" className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center">
                  <Info size={20} className="me-2 text-primary" />
                  Info
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Menu Content */}
      <Container className="py-5">
        <Row className="gy-5">
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Menu Items</h2>
              {fetchingMenu && <span className="text-muted small">Fetching actual prices...</span>}
            </div>
            <div className="menu-list">
              {restaurant.menu?.map((item) => (
                <MenuItem 
                  key={item.id} 
                  item={item} 
                  onAdd={() => addToCart(item, restaurant.id)}
                  onRemove={() => removeFromCart(item.id)}
                  quantity={cart.find(i => i.id === item.id)?.quantity || 0}
                />
              ))}
            </div>
          </Col>
          
          <Col lg={4}>
            <div className="sticky-top" style={{ top: "100px" }}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Cart Summary</h5>
                  {cart.length > 0 ? (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 small">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <hr className="my-4 opacity-25" />
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="fw-bold">Subtotal</span>
                        <span className="fw-bold fs-5 text-primary">
                          ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                        </span>
                      </div>
                      <Button as={Link as any} to="/cart" variant="primary" className="w-100 py-3 rounded-pill fw-bold shadow-sm">
                        Checkout
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">Your cart is empty.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
