import { Button, Col, Row } from "react-bootstrap";
import { EntityId } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";

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
      <Col sm={9} md={10} className="order-sm-max-2  col-12">
        {renderGetHeaders()}
        {renderedContentEntities}
      </Col>

      <Col sm={3} md={2} className="order-sm-max-1 col-12 ">
        <Button variant="outline-primary">
          <Link className="link" to={linkPath}>
            {linkText}
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
