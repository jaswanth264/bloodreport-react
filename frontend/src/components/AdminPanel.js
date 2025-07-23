import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Alert, Button, Spinner } from "react-bootstrap";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function AdminPanel({ session, onSignOut }) {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const access = { headers: { Authorization: "Bearer " + session.access_token } };
    axios.get(`${API_BASE}/all-reports`, access)
      .then(res => {
        setAllReports(res.data || []);
        setLoading(false);
      });
  }, [session]);

  return (
    <Container className="mt-4">
      <Button className="float-end" onClick={onSignOut} variant="secondary">Logout</Button>
      <h4>Admin: All User Blood Reports</h4>
      {loading 
        ? <Spinner animation="border" />
        : <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {allReports.map(r => (
                <tr key={r.id}>
                  <td>{r.profiles?.username}</td>
                  <td>{r.profiles?.name}</td>
                  <td>{r.profiles?.age}</td>
                  <td>{r.profiles?.email}</td>
                  <td>
                    <a href={r.report_url} target="_blank" rel="noopener noreferrer">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
      }
      {!loading && allReports.length === 0 && (
        <Alert variant="info">No user reports uploaded yet.</Alert>
      )}
    </Container>
  );
}
