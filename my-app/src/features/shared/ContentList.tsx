import { Button, Col, Row } from "react-bootstrap";
import { EntityId } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import "./ContentList.scss";

export const ContentList = ({
  entityIds,
  linkPath,
  linkText,
  renderGetHeaders,
  renderGetEntities,
}: {
  entityIds: EntityId[];
  linkPath: string;
  linkText: string;
  renderGetHeaders: () => JSX.Element;
  renderGetEntities: (key: React.Key, entityId: EntityId, index: number) => JSX.Element;
}) => {
  const renderedContentEntities = entityIds.map((entityId, index) => {
    return renderGetEntities(entityId, entityId, index);
  });
  return (
    <Row className="list-content justify-content-between">
      <Col md={10}>
        {renderGetHeaders()}
        {renderedContentEntities}
      </Col>

      <Col md={2} className="fixed-on-sm d-flex">
        <Button variant="outline-primary" className="align-self-start flex-shrink-0 bg-white">
          <Link className="link" to={linkPath}>
            {linkText}
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
