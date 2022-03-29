import React from "react";
import { Button, Col, Row } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { TimeAgo } from "../shared/TimeAgo";
import { selectUserById, selectUserIds } from "./usersSlice";
import "./Users.scss";
import { Link } from "react-router-dom";

export const Users = () => {
  const usersIds = useAppSelector(selectUserIds);
  const renderedContentUsers = usersIds.map((userId) => {
    return <UserExcerpt key={userId} userId={userId}></UserExcerpt>;
  });
  return (
    <Row className="users-content justify-content-between">
      <Col sm={9} md={10} className="order-sm-max-2  col-12">
        {renderedContentUsers}
      </Col>

      <Col sm={3} md={2} className="order-sm-max-1 col-12 ">
        <Button variant="outline-primary">
          <Link className="link" to="users/addUser">
            add user
          </Link>
        </Button>
      </Col>
    </Row>
  );
};

type userExcerptProps = {
  userId: number | string;
};

export const UserExcerpt = ({ userId }: userExcerptProps) => {
  const user = useAppSelector((state) => selectUserById(state, userId));

  return (
    <Row className="mb-1">
      <Col>Username: {user?.username}</Col>
      <Col>
        created: <TimeAgo timeStamp={user?.created}></TimeAgo>
      </Col>
      <Col>
        <Button variant="outline-secondary">
          <Link className="link" to={`users/editUser/${user?.id}`}>
            edit user
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
