import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./App.scss";
import { Users } from "./features/users/Users";

function App() {
  return (
    <div className="page">
      <header className="page__header">header content</header>
      <main className="page__body">
        <Container fluid>
          <Row>
            <Users></Users>
          </Row>
        </Container>
      </main>
      <footer className="page__footer">footer content</footer>
    </div>
  );
}

export default App;
