import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Col, Container, Nav, Row, Tabs, Tab } from "react-bootstrap";
import "./App.scss";
import { Users } from "./features/users/Users";
import { Groups } from "./features/groups/Groups";
import { AddUserForm } from "./features/users/AddUserForm";
import { EditUserFormParamGetter } from "./features/users/EditUserForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />}>
        <Route index element={<Users />}></Route>
        <Route path="users/addUser" element={<AddUserForm />}></Route>
        <Route path="users/editUser/:userId" element={<EditUserFormParamGetter />}></Route>
        <Route path="groups" element={<Groups />}></Route>
      </Route>
    </Routes>
  );
}

const AppContent = () => {
  return (
    <div className="page">
      <header className="page__header">
        <NavBarWrapper />
      </header>
      <main className="page__body">
        <Container>
          <Row>
            <Outlet></Outlet>
          </Row>
        </Container>
      </main>
      <footer className="page__footer">footer content</footer>
    </div>
  );
};

function NavBarWrapper() {
  const location = useLocation();
  const [activeLocationPath, setActiveLocation] = useState("");
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveLocation(location.pathname);
    } else {
      setActiveLocation(location.pathname.replace("/", ""));
    }
  }, [location]);

  if (!activeLocationPath) return null;

  return <NavBar activeLocPath={activeLocationPath}></NavBar>;
}

function NavBar({ activeLocPath }: { activeLocPath: string }) {
  const [key, setKey] = useState<string>(activeLocPath);
  const navigate = useNavigate();

  return (
    <Tabs
      activeKey={key}
      onSelect={(k) => {
        if (k) {
          navigate(`${k}`);
          setKey(k);
        }
      }}
      className="mb-3"
    >
      <Tab eventKey="/" title="Home"></Tab>
      <Tab eventKey="groups" title="Groups"></Tab>
    </Tabs>
  );
}

export default App;
