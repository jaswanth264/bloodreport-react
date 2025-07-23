import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Container, Button } from "react-bootstrap";

export default function AuthPage({ onLogin }) {
  const [register, setRegister] = useState(false);

  return (
    <Container style={{ maxWidth: 420, marginTop: 50 }}>
      {register ? (
        <>
          <h4>Create Account</h4>
          <RegisterForm onSuccess={onLogin} />
          <Button variant="link" onClick={() => setRegister(false)}>
            Already have an account? Login
          </Button>
        </>
      ) : (
        <>
          <h4>User Login</h4>
          <LoginForm onSuccess={onLogin} />
          <Button variant="link" onClick={() => setRegister(true)}>
            New user? Register
          </Button>
        </>
      )}
    </Container>
  );
}
