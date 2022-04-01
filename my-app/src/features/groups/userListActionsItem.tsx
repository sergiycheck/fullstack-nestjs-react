import { Row, Col, ListGroup } from "react-bootstrap";
import { User } from "../users/types";

export const UsersListActionsItem = ({
  user,
  onSelectedUsersChanged,
  renderButton,
}: {
  user: User;
  onSelectedUsersChanged: (userId: User) => void;
  renderButton: (user: User, onSelectedUsersChanged: (userId: User) => void) => JSX.Element;
}) => {
  return (
    <ListGroup.Item>
      <Row>
        <Col>{user.username}</Col>
        <Col>{renderButton(user, onSelectedUsersChanged)}</Col>
      </Row>
    </ListGroup.Item>
  );
};
