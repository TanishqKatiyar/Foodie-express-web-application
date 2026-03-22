import { Navbar, Nav, Container, Badge, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, MapPin, UtensilsCrossed } from "lucide-react";
import { APP_NAME } from "../constants";

export default function AppNavbar({ cartCount, user, onLogout }: { cartCount: number, user: any, onLogout: () => void }) {
  const navigate = useNavigate();

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link as any} to="/" className="d-flex align-items-center fw-bold text-primary fs-4">
          <UtensilsCrossed className="me-2" />
          {APP_NAME}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link as any} to="/" className="mx-2">Home</Nav.Link>
            <Nav.Link as={Link as any} to="/restaurants" className="mx-2">Restaurants</Nav.Link>
            <Nav.Link as={Link as any} to="/about" className="mx-2">About</Nav.Link>
            <Nav.Link as={Link as any} to="/cart" className="mx-2 d-flex align-items-center gap-2">
              <div className="position-relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span className="fw-medium">Cart</span>
            </Nav.Link>
            
            {user ? (
              <Dropdown align="end" className="ms-3">
                <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center border-0 bg-transparent">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32 }}>
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="d-none d-md-inline">{user.displayName || user.email}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0">
                  <Dropdown.Item as={Link as any} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link as any} to="/orders">My Orders</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onLogout} className="text-danger d-flex align-items-center">
                    <LogOut size={16} className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link as any} to="/login" variant="primary" className="ms-3 px-4 rounded-pill">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
