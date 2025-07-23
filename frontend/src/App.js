import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container } from "react-bootstrap";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_e, session) => setSession(session));
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      if (!session) return;
      // Fetch role from profiles table
      const { data,  } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      setIsAdmin(data?.role === "admin");
    };
    checkRole();
  }, [session]);

  const handleSignOut = () => supabase.auth.signOut();

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>
            Blood Report Portal
          </Navbar.Brand>
        </Container>
      </Navbar>
      {session
        ? isAdmin
          ? <AdminPanel session={session} onSignOut={handleSignOut} />
          : <Dashboard session={session} onSignOut={handleSignOut} />
        : <AuthPage onLogin={() => window.location.reload()} />
      }
    </>
  );
}

export default App;
