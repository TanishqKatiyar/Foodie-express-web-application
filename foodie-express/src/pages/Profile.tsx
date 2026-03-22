import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from "react-bootstrap";
import { User, Mail, Phone, MapPin, Edit2, Save, X, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { profile, user, updateUserProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      await updateUserProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="fw-bold mb-2">My Profile</h1>
        <p className="text-muted">Manage your personal information and delivery details</p>
      </div>

      <Row className="gy-5">
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden text-center p-5 mb-4">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm mx-auto" style={{ width: 100, height: 100 }}>
              <User size={48} />
            </div>
            <h4 className="fw-bold mb-1">{profile?.displayName}</h4>
            <p className="text-muted small mb-4">{profile?.email}</p>
            <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill border shadow-sm">
              Member since {new Date(user?.createdAt || "").toLocaleDateString()}
            </Badge>
          </Card>
          
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-primary text-white p-4">
            <h5 className="fw-bold mb-3">Foodie Rewards</h5>
            <p className="small opacity-75 mb-4">You have 250 points! Order more to unlock exclusive discounts.</p>
            <Button variant="light" className="w-100 rounded-pill fw-bold text-primary">
              View Rewards
            </Button>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Personal Information</h5>
              {!isEditing ? (
                <Button variant="outline-primary" size="sm" className="rounded-pill px-3 d-flex align-items-center" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} className="me-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" size="sm" className="rounded-pill px-3 d-flex align-items-center" onClick={() => setIsEditing(false)}>
                    <X size={16} className="me-2" />
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" className="rounded-pill px-3 d-flex align-items-center" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                    {isSaving ? <Spinner animation="border" size="sm" className="me-2" /> : <Save size={16} className="me-2" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="gy-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">Full Name</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0"><User size={18} className="text-muted" /></span>
                        <Form.Control 
                          type="text" 
                          placeholder="Your Name" 
                          className="bg-light border-0 py-3" 
                          {...register("displayName")}
                          disabled={!isEditing}
                          isInvalid={!!errors.displayName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.displayName?.message}</Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0"><Mail size={18} className="text-muted" /></span>
                        <Form.Control type="email" value={profile?.email} className="bg-light border-0 py-3" disabled />
                      </div>
                      <Form.Text className="text-muted small">Email cannot be changed.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0"><Phone size={18} className="text-muted" /></span>
                        <Form.Control 
                          type="tel" 
                          placeholder="+1 (555) 000-0000" 
                          className="bg-light border-0 py-3" 
                          {...register("phone")}
                          disabled={!isEditing}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-muted text-uppercase">Delivery Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0"><MapPin size={18} className="text-muted" /></span>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          placeholder="Enter your full delivery address" 
                          className="bg-light border-0 py-3" 
                          {...register("address")}
                          disabled={!isEditing}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
