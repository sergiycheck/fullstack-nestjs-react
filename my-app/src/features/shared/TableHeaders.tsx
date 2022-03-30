import { Col, Row } from "react-bootstrap";

export const TableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <Row>
      {headers.map((header, index) => (
        <Col key={index}>
          <strong>{header}</strong>
        </Col>
      ))}
    </Row>
  );
};
