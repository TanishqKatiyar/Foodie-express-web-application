import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, UtensilsCrossed } from "lucide-react";
import { APP_NAME } from "../constants";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    navigate(from, { replace: true });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    await loginWithEmail(email, email.split("@")[0]);
    navigate(from, { replace: true });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <Row className="w-100 justify-content-center">
        <Col lg={5} md={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: 64, height: 64 }}>
                    <UtensilsCrossed size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">Welcome Back!</h2>
                  <p className="text-muted">Login to your {APP_NAME} account</p>
                </div>

                <Form className="mb-4" onSubmit={handleEmailLogin}>
                  <Form.Group className="mb-4 position-relative">
                    <Form.Label className="small fw-bold text-muted text-uppercase">Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Mail size={18} className="text-muted" /></span>
                      <Form.Control 
                        type="email" 
                        placeholder="name@example.com" 
                        className="bg-light border-0 py-3" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4 position-relative">
                    <Form.Label className="small fw-bold text-muted text-uppercase">Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Lock size={18} className="text-muted" /></span>
                      <Form.Control 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-light border-0 py-3" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4">
                    Sign In
                  </Button>
                </Form>

                <div className="text-center mb-4">
                  <span className="text-muted small px-3 bg-white position-relative z-index-1">OR CONTINUE WITH</span>
                  <hr className="mt-n2 opacity-25" />
                </div>

                <Button variant="outline-dark" className="w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center mb-4" onClick={handleGoogleLogin}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="me-2" style={{ width: 20 }} />
                  Login with Google
                </Button>

                <div className="text-center">
                  <p className="text-muted small mb-0">
                    Don't have an account? <Link to="/signup" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
