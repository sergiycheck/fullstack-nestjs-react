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
    <Row className="list-content gx-md-1">
      <Col md={9} sm={12} className="table-content-wrapper">
        <div className="table-content-data">
          {renderGetHeaders()}
          {renderedContentEntities}
        </div>
      </Col>

      <Col md={2} sm={12} className="fixed-on-sm d-flex mx-auto justify-content-end">
        <Button variant="outline-primary" className="align-self-start flex-shrink-0 bg-white">
          <Link className="link" to={linkPath}>
            {linkText}
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
