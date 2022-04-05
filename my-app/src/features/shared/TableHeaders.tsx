import { Col, Row } from "react-bootstrap";
import classNames from "classnames";

export const TableHeader = ({
  headers,
  rowClassName,
}: {
  headers: { title: string; classes?: string }[];
  rowClassName: string;
}) => {
  return (
    <Row className={classNames(rowClassName, "justify-content-between")}>
      {headers.map((header, index) => (
        <Col
          className={classNames(
            index === 0 ? "col-auto" : "",
            "d-flex justify-content-end",
            header?.classes
          )}
          key={index}
        >
          <strong>{header.title}</strong>
        </Col>
      ))}
    </Row>
  );
};
