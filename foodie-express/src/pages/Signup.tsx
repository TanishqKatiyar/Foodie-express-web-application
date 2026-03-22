import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock, User, UtensilsCrossed } from "lucide-react";
import { APP_NAME } from "../constants";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useState } from "react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });
      
      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: data.email,
        displayName: data.name,
        role: "user",
      });

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
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
                  <h2 className="fw-bold mb-2">Create Account</h2>
                  <p className="text-muted">Join {APP_NAME} today</p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                  <Form.Group className="mb-4 position-relative">
                    <Form.Label className="small fw-bold text-muted text-uppercase">Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><User size={18} className="text-muted" /></span>
                      <Form.Control 
                        type="text" 
                        placeholder="John Doe" 
                        className="bg-light border-0 py-3" 
                        {...register("name")}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4 position-relative">
                    <Form.Label className="small fw-bold text-muted text-uppercase">Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Mail size={18} className="text-muted" /></span>
                      <Form.Control 
                        type="email" 
                        placeholder="name@example.com" 
                        className="bg-light border-0 py-3" 
                        {...register("email")}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
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
                        {...register("password")}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted small mb-0">
                    Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
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
