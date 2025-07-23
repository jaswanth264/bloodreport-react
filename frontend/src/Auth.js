import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setSent(true);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 360 }}>
      <h3 className="mb-3">Login or Register</h3>
      {sent ? (
        <Alert variant="info">Check your email for a magic login link.</Alert>
      ) : (
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary">Send Magic Link</Button>
          {message && <Alert className="mt-3" variant="danger">{message}</Alert>}
        </Form>
      )}
    </Container>
  );
}
