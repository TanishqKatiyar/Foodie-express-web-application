import { Container, Card } from "react-bootstrap";
import { MapPin } from "lucide-react";

export default function Map({ address }: { address?: string }) {
  // In a real app, you would use Google Maps React SDK here.
  // For this project, we'll use an iframe with a placeholder or static map.
  const encodedAddress = encodeURIComponent(address || "Gourmet City, FC 12345");
  
  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
      <Card.Header className="bg-white border-bottom p-4 d-flex align-items-center">
        <MapPin size={20} className="text-primary me-2" />
        <h6 className="fw-bold mb-0">Delivery Location</h6>
      </Card.Header>
      <div className="position-relative" style={{ height: "300px" }}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`}
          allowFullScreen
          title="Delivery Location"
        ></iframe>
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75">
          <div className="text-center p-4">
            <MapPin size={48} className="text-primary mb-3" />
            <h5 className="fw-bold">Google Maps Integration</h5>
            <p className="text-muted small">Real-time tracking and location services enabled.</p>
            <p className="text-muted small italic">(Requires Google Maps API Key in .env)</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
