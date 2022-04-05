import { Col, Row } from "react-bootstrap";
import classNames from "classnames";

export const TableHeader = ({
  headers,
  rowClassName,
}: {
  headers: string[];
  rowClassName: string;
}) => {
  return (
    <Row className={classNames(rowClassName, "justify-content-between")}>
      {headers.map((header, index) => (
        <Col
          className={classNames(index === 0 ? "col-auto" : "", "d-flex justify-content-end")}
          key={index}
        >
          <strong>{header}</strong>
        </Col>
      ))}
    </Row>
  );
};
