import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Utensils, Clock, ShieldCheck, Star, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import { Restaurant } from "../types";
import { RestaurantSkeleton } from "../components/Skeleton";
import { GoogleGenAI, Type } from "@google/genai";
import toast from "react-hot-toast";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [findingNearby, setFindingNearby] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/restaurants");
        setRestaurants(response.data.filter((r: Restaurant) => r.featured));
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleFindNearby = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setFindingNearby(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setUserAddress(null);
        
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey || apiKey === "undefined") {
            throw new Error("Gemini API key is not configured. Please ensure it is set in your environment variables.");
          }
          const ai = new GoogleGenAI({ apiKey });
          
          // Call 1: Get the human-readable address (JSON mode, no tools)
          const addressResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `What is the human-readable address for the coordinates (${latitude}, ${longitude})?`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  address: { type: Type.STRING }
                },
                required: ["address"]
              }
            }
          });
          
          const addressResult = JSON.parse(addressResponse.text);
          setUserAddress(addressResult.address);

          // Call 2: Get restaurants (Google Maps tool, NO JSON mode)
          const mapsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find 4 highly-rated restaurants exactly near the coordinates (${latitude}, ${longitude}).`,
            config: {
              tools: [{ googleMaps: {} }],
              toolConfig: {
                retrievalConfig: {
                  latLng: {
                    latitude,
                    longitude
                  }
                }
              }
            },
          });

          const chunks = mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
          
          if (chunks && chunks.length > 0) {
            const nearbyRestaurants: Restaurant[] = chunks
              .filter(chunk => chunk.maps)
              .map((chunk, index) => ({
                id: `nearby-${index}`,
                name: chunk.maps!.title || "Nearby Restaurant",
                cuisine: "Local Favorite",
                rating: 4.5 + (Math.random() * 0.4),
                deliveryTime: "20-35 min",
                image: `https://loremflickr.com/400/300/${encodeURIComponent(chunk.maps!.title || "restaurant")},food/all`,
                featured: true,
                mapsUrl: chunk.maps!.uri
              }));

            if (nearbyRestaurants.length > 0) {
              // Call 3: Get descriptive keywords for these restaurants for better images
              try {
                const keywordsResponse = await ai.models.generateContent({
                  model: "gemini-3-flash-preview",
                  contents: `For these restaurants: ${nearbyRestaurants.map(r => r.name).join(", ")}, provide a single descriptive food keyword for each (e.g., "burger", "sushi", "pasta", "tacos").`,
                  config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          keyword: { type: Type.STRING }
                        },
                        required: ["name", "keyword"]
                      }
                    }
                  }
                });
                
                const keywords = JSON.parse(keywordsResponse.text);
                nearbyRestaurants.forEach(res => {
                  const match = keywords.find((k: any) => k.name.toLowerCase().includes(res.name.toLowerCase()) || res.name.toLowerCase().includes(k.name.toLowerCase()));
                  if (match) {
                    res.image = `https://loremflickr.com/400/300/${encodeURIComponent(match.keyword)},food/all`;
                  }
                });
              } catch (kwError) {
                console.error("Error fetching keywords:", kwError);
                // Fallback already set in map
              }

              setRestaurants(nearbyRestaurants);
              toast.success(`Found ${nearbyRestaurants.length} restaurants near you!`);
            } else {
              toast.error("Could not find any specific restaurants nearby.");
            }
          } else {
            toast.error("No nearby restaurants found in this area.");
          }
        } catch (error: any) {
          console.error("Gemini error:", error);
          toast.error(error.message || "Failed to fetch nearby restaurants");
        } finally {
          setFindingNearby(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Location access denied. Please enable it in your browser settings.");
        setFindingNearby(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white py-5 position-relative overflow-hidden" style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
        <Container className="position-relative z-index-1">
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="display-3 fw-bold mb-4">Delicious Food, <span className="text-primary">Delivered Fast</span></h1>
                <p className="lead mb-5 opacity-75">Order from the best restaurants in your city and enjoy a gourmet experience at home. Fresh ingredients, expert chefs, and lightning-fast delivery.</p>
                <div className="d-flex flex-wrap gap-3">
                  <Button as={Link as any} to="/restaurants" variant="primary" size="lg" className="px-5 rounded-pill fw-bold shadow">
                    Order Now
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="px-5 rounded-pill fw-bold d-flex align-items-center"
                    onClick={handleFindNearby}
                    disabled={findingNearby}
                  >
                    {findingNearby ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Finding...
                      </>
                    ) : (
                      <>
                        <Navigation size={20} className="me-2" />
                        Find Nearby
                      </>
                    )}
                  </Button>
                </div>
                {userAddress && (
                  <p className="mt-3 small text-primary d-flex align-items-center">
                    <MapPin size={14} className="me-1" />
                    Near: {userAddress}
                  </p>
                )}
              </motion.div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" 
                  alt="Delicious Pizza" 
                  className="img-fluid rounded-circle shadow-lg border border-5 border-primary"
                  style={{ width: "450px", height: "450px", objectFit: "cover" }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold fs-1">Why Choose Us?</h2>
              <p className="text-muted">We provide the best service for your hunger.</p>
            </Col>
          </Row>
          <Row className="gy-4">
            {[
              { icon: <Utensils className="text-primary" size={40} />, title: "Best Restaurants", desc: "We partner with top-rated restaurants to ensure quality." },
              { icon: <Clock className="text-primary" size={40} />, title: "Fast Delivery", desc: "Our delivery partners ensure your food arrives hot and fresh." },
              { icon: <ShieldCheck className="text-primary" size={40} />, title: "Secure Payment", desc: "Safe and secure payment options for a worry-free experience." },
              { icon: <Star className="text-primary" size={40} />, title: "Great Offers", desc: "Enjoy exclusive discounts and deals on every order." },
            ].map((feature, idx) => (
              <Col key={idx} lg={3} md={6}>
                <motion.div whileHover={{ y: -10 }} className="p-4 text-center h-100 rounded-4 border-0 shadow-sm bg-light">
                  <div className="mb-4">{feature.icon}</div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted small mb-0">{feature.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured/Nearby Restaurants */}
      <section className="featured-section py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold fs-1">{userAddress ? `Near ${userAddress}` : "Featured Restaurants"}</h2>
              <p className="text-muted mb-0">{userAddress ? "Handpicked for your current location." : "Handpicked favorites for you."}</p>
            </div>
            <Link to="/restaurants" className="text-primary fw-bold text-decoration-none">View All Restaurants &rarr;</Link>
          </div>
          
          <Row className="gy-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <Col key={idx} lg={3} md={6}>
                  <RestaurantSkeleton />
                </Col>
              ))
            ) : (
              restaurants.map((restaurant) => (
                <Col key={restaurant.id} lg={3} md={6}>
                  <RestaurantCard restaurant={restaurant} />
                  {restaurant.mapsUrl && (
                    <div className="mt-2 text-center">
                      <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="small text-primary text-decoration-none d-flex align-items-center justify-content-center">
                        <MapPin size={12} className="me-1" />
                        View on Maps
                      </a>
                    </div>
                  )}
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* App Promo Section */}
      <section className="promo-section py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="display-5 fw-bold mb-4">Get the Foodie App</h2>
              <p className="lead mb-5 opacity-75">Order food on the go with our mobile app. Available on iOS and Android.</p>
              <div className="d-flex gap-3">
                <Button variant="light" className="px-4 py-2 rounded-3 d-flex align-items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" style={{ height: 30 }} />
                </Button>
                <Button variant="light" className="px-4 py-2 rounded-3 d-flex align-items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: 30 }} />
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center d-none d-lg-block">
              <img src="https://picsum.photos/seed/app-mockup/400/600" alt="App Mockup" className="img-fluid rounded-4 shadow-lg" style={{ maxHeight: 500 }} />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
