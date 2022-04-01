import React, { useState } from "react";
import { Alert, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { removeUserFromGroupThunk, RemoveOrAddUserToGroupResponse } from "../groupThunks";
import { User } from "../../users/types";
import { selectUserById } from "../../users/usersSlice";

export const RemoveUsersComponent = ({
  usersIds,
  groupId,
}: {
  usersIds: string[];
  groupId: string;
}) => {
  if (!usersIds.length) return null;

  const renderedGroupMembersToRemove = usersIds.map((userId) => {
    return (
      <RemoveUserFromGroupActionItem
        key={userId}
        userId={userId}
        groupId={groupId}
      ></RemoveUserFromGroupActionItem>
    );
  });

  return (
    <Row>
      <Col>
        <Row>
          <Col>Remove users from group</Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>{renderedGroupMembersToRemove}</ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export const RemoveUserFromGroupActionItem = ({
  userId,
  groupId,
}: {
  userId: string;
  groupId: string;
}) => {
  const dispatch = useAppDispatch();

  const [removeUserSuccess, setRemoveUserSuccess] = useState(false);
  const [removeUserMsg, setRemoveUserMsg] = useState("");

  const user = useAppSelector((state) => selectUserById(state, userId));

  const removeUserFromGroupHandler = async (user: User | undefined) => {
    if (!user) return;

    const result = (await dispatch(
      removeUserFromGroupThunk(groupId, user.id)
    )) as unknown as RemoveOrAddUserToGroupResponse;

    setRemoveUserMsg(result.message);
    setRemoveUserSuccess(result.success);
  };

  return (
    <ListGroup.Item>
      <Row>
        <Col>username: {user?.username}</Col>
        <Col>
          <Button onClick={() => removeUserFromGroupHandler(user)} variant="outline-primary">
            remove user
          </Button>
        </Col>
        <Col>
          <Alert show={removeUserSuccess} variant="success">
            <p>{removeUserMsg}</p>
          </Alert>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};
