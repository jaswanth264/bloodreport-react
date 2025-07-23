import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function LoginForm({ onSuccess }) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: fields.email,
      password: fields.password
    });

    setLoading(false);
    if (loginError) setError(loginError.message);
    else onSuccess();
  };

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-2">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          name="email"
          value={fields.email}
          onChange={handleChange}
          type="email"
          required
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          value={fields.password}
          onChange={handleChange}
          type="password"
          required
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Login"}
      </Button>
    </Form>
  );
}
