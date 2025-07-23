import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { Container, Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Dashboard({ session, onSignOut, isAdmin }) {
  const [profile, setProfile] = useState({ username: "", name: "", age: "", email: "" });
  const [report, setReport] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const access = { headers: { Authorization: "Bearer " + session.access_token } };
    // Load profile info
    axios.post(`${API_BASE}/profile`, {}, access)
      .then(res => setProfile(p => ({ ...p, ...res.data })))
      .catch(() => {});
    // Load report
    axios.get(`${API_BASE}/my-report`, access)
      .then(res => setReport(res.data)).catch(() => setReport(null));
  }, [session]);

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const res = await axios.post(`${API_BASE}/profile`, profile, {
      headers: { Authorization: "Bearer " + session.access_token }
    });
    setProfile(p => ({ ...p, ...res.data }));
    setMsg("Profile Updated!");
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    if (!file) {
      setMsg("Choose a PDF report file.");
      setLoading(false);
      return;
    }
    const filename = `${session.user.id}/report.pdf`;
    const { error } = await supabase.storage
      .from("reports")
      .upload(filename, file, { upsert: false });
    if (error) {
      setMsg("Upload failed or already exists.");
      setLoading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("reports").getPublicUrl(filename);
    await axios.post(
      `${API_BASE}/upload-report`,
      { report_url: publicUrl },
      { headers: { Authorization: "Bearer " + session.access_token } }
    );
    setReport({ report_url: publicUrl });
    setMsg("Report uploaded!");
    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <Button onClick={onSignOut} className="float-end" variant="secondary">Logout</Button>
      <h4>Welcome, {profile.username || profile.email}</h4>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleProfile}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={profile.name || ""}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Age</Form.Label>
              <Form.Control
                name="age"
                type="number"
                value={profile.age || ""}
                onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Save Profile"}
            </Button>
          </Form>
          <div className="mt-3">Email: {profile.email}</div>
          {msg && <Alert className="mt-2" variant="info">{msg}</Alert>}
        </Col>
        <Col md={6}>
        {report && report.report_url
          ? <Alert variant="success" className="mt-2">Your Report: <a href={report.report_url} target="_blank" rel="noreferrer">View</a></Alert>
          : <Form className="mt-2" onSubmit={handleUpload}>
              <Form.Group>
                <Form.Label>Upload Blood Test Report (PDF only, upload once)</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={e => setFile(e.target.files[0])}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="mt-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Upload Report"}
              </Button>
            </Form>
        }
        </Col>
      </Row>
    </Container>
  );
}
