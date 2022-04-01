import React, { useState } from "react";
import { Alert, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { removeUserFromGroupThunk } from "../groupThunks";
import { User } from "../../users/types";
import { selectUserById } from "../../users/usersSlice";
import { RemoveOrAddUserToGroupResponse } from "../types";

export const RemoveUsersComponent = ({
  usersIds,
  groupId,
}: {
  usersIds: string[] | null;
  groupId: string;
}) => {
  const [removeUserSuccess, setRemoveUserSuccess] = useState(false);
  const [removeUserMsg, setRemoveUserMsg] = useState("");

  if (!usersIds || !usersIds.length) return <div>no users found</div>;
  const renderedGroupMembersToRemove = usersIds.map((userId) => {
    return (
      <RemoveUserFromGroupActionItem
        key={userId}
        userId={userId}
        groupId={groupId}
        setRemoveUserMsg={setRemoveUserMsg}
        setRemoveUserSuccess={setRemoveUserSuccess}
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
            <Alert show={removeUserSuccess} variant="success">
              <p>{removeUserMsg}</p>
            </Alert>
          </Col>
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
  setRemoveUserSuccess,
  setRemoveUserMsg,
}: {
  userId: string;
  groupId: string;
  setRemoveUserSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoveUserMsg: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const dispatch = useAppDispatch();

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
      </Row>
    </ListGroup.Item>
  );
};
