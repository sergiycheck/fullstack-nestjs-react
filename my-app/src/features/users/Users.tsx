import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { TimeAgo } from "./TimeAgo";
import { selectUserById, selectUserIds } from "./usersSlice";

export const Users = () => {
  const usersIds = useAppSelector(selectUserIds);
  const renderedContentUsers = usersIds.map((userId) => {
    return <UserExcerpt key={userId} userId={userId}></UserExcerpt>;
  });
  return <div>{renderedContentUsers}</div>;
};

type userExcerptProps = {
  userId: number | string;
};

export const UserExcerpt = ({ userId }: userExcerptProps) => {
  const user = useAppSelector((state) => selectUserById(state, userId));

  return (
    <Row>
      <Col>Username: {user?.username}</Col>
      <Col>
        created: <TimeAgo timeStamp={user?.created}></TimeAgo>
      </Col>
    </Row>
  );
};
