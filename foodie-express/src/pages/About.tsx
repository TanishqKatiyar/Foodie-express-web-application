import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { UtensilsCrossed, ShieldCheck, Heart, Users } from "lucide-react";
import { APP_NAME } from "../constants";

export default function About() {
  return (
    <div className="about-page py-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h1 className="display-4 fw-bold mb-4">About <span className="text-primary">{APP_NAME}</span></h1>
              <p className="lead text-muted">
                We are on a mission to bring the best food from local restaurants directly to your doorstep.
                Our platform connects hungry foodies with the culinary gems of the city.
              </p>
            </Col>
          </Row>

          <Row className="gy-4 mb-5">
            {[
              { icon: <UtensilsCrossed size={40} className="text-primary" />, title: "Quality Food", desc: "We only partner with restaurants that meet our high standards for quality and hygiene." },
              { icon: <ShieldCheck size={40} className="text-primary" />, title: "Safe Delivery", desc: "Your safety is our priority. We ensure contactless and secure delivery for every order." },
              { icon: <Heart size={40} className="text-primary" />, title: "Customer First", desc: "Our support team is always ready to help you with any questions or concerns." },
              { icon: <Users size={40} className="text-primary" />, title: "Community", desc: "We support local businesses and help them grow by reaching more customers." },
            ].map((item, idx) => (
              <Col key={idx} lg={3} md={6}>
                <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                  <div className="mb-3">{item.icon}</div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="align-items-center py-5">
            <Col lg={6}>
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Team" 
                className="img-fluid rounded-4 shadow"
                referrerPolicy="no-referrer"
              />
            </Col>
            <Col lg={6} className="ps-lg-5 mt-4 mt-lg-0">
              <h2 className="fw-bold mb-4">Our Story</h2>
              <p className="text-muted mb-4">
                Founded in 2024, {APP_NAME} started as a small project to help local cafes reach more people. 
                Today, we are proud to serve thousands of customers every day, delivering happiness in every box.
              </p>
              <p className="text-muted">
                Whether you're craving a late-night snack or planning a family dinner, we've got you covered. 
                Thank you for being part of our journey!
              </p>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
}
