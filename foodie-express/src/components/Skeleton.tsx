import { Card, Placeholder } from "react-bootstrap";

export function RestaurantSkeleton() {
  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden">
      <Placeholder as="div" animation="glow">
        <Placeholder className="w-100" style={{ height: "200px" }} />
      </Placeholder>
      <Card.Body className="p-4">
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={6} /> <Placeholder xs={4} />
        </Placeholder>
        <Placeholder.Button variant="primary" xs={12} className="rounded-pill" />
      </Card.Body>
    </Card>
  );
}

export function MenuSkeleton() {
  return (
    <Card className="mb-4 border-0 shadow-sm overflow-hidden">
      <div className="row g-0 align-items-center">
        <div className="col-md-4">
          <Placeholder as="div" animation="glow">
            <Placeholder className="w-100" style={{ height: "180px" }} />
          </Placeholder>
        </div>
        <div className="col-md-8">
          <Card.Body className="p-4">
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={10} /> <Placeholder xs={8} />
            </Placeholder>
            <Placeholder.Button variant="primary" xs={4} className="rounded-pill" />
          </Card.Body>
        </div>
      </div>
    </Card>
  );
}
