import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function RegisterForm({ onSuccess }) {
  const [fields, setFields] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (fields.password !== fields.confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (!fields.username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: fields.email,
      password: fields.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        email: fields.email,
        username: fields.username
      });
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <Form onSubmit={handleRegister}>
      <Form.Group className="mb-2">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          value={fields.username}
          onChange={handleChange}
          required
        />
      </Form.Group>
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
          minLength={6}
          required
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          name="confirm"
          value={fields.confirm}
          onChange={handleChange}
          type="password"
          minLength={6}
          required
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Register"}
      </Button>
    </Form>
  );
}
