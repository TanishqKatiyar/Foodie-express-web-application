import React, { Component, ErrorInfo, ReactNode } from "react";
import { Container, Alert, Button } from "react-bootstrap";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger" className="rounded-4 p-5 shadow-sm">
            <Alert.Heading className="fw-bold mb-4">Something went wrong</Alert.Heading>
            <p className="mb-4">
              We encountered an error while processing your request. This might be due to a connection issue or a security restriction.
            </p>
            {this.state.error && (
              <pre className="bg-dark text-white p-3 rounded small mb-4 overflow-auto" style={{ maxHeight: "200px" }}>
                {this.state.error.message}
              </pre>
            )}
            <Button variant="danger" className="rounded-pill px-4" onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
