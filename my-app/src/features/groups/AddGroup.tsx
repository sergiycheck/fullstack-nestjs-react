import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { StatusData } from "../shared/types";
import { fetchAddGroupAsync } from "./groupThunks";
import { Group } from "../groups/types";
import { useToSelectOfFetchUsers } from "../users/UserHooks";
import { selectUsersWithoutGroup } from "../users/usersSlice";
import { fetchUsersAsync } from "../users/userThunks";
import { unwrapResult } from "@reduxjs/toolkit";
import { Form, Alert, Button, Row, Col, ListGroup } from "react-bootstrap";
import { User } from "../users/types";

export const AddGroup = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [requestStatus, setRequestStatus] = useState(StatusData.idle);

  const { entities: users } = useToSelectOfFetchUsers({
    selectUsers: selectUsersWithoutGroup,
    fetchUsersAsync,
  });

  const [initialUsers, setInitialUsers] = useState<User[]>([]);

  useEffect(() => {
    setInitialUsers(users);
  }, [users]);

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const canSave = Boolean(name) && Boolean(description) && requestStatus === StatusData.idle;

  const [showAlert, setShowAlert] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  const resetAlertAndMessage = () => {
    setShowAlert(false);
    setShowMessage("");
  };

  const onNameChanged = (event: any) => {
    setName(event.currentTarget.value.trim());
    resetAlertAndMessage();
  };

  const onDescriptionChanged = (event: any) => {
    setDescription(event.currentTarget.value.trim());
    resetAlertAndMessage();
  };

  const onSelectedUsersChangedAdd = (user: User) => {
    const userToRemove = user;
    setInitialUsers(initialUsers.filter((user) => user.id !== userToRemove.id));

    setSelectedUsers([...selectedUsers, user]);
  };

  const onSelectedUsersChangedRemoved = (userToRemove: User) => {
    let user = userToRemove;
    setInitialUsers([...initialUsers, user]);

    setSelectedUsers(selectedUsers.filter((user) => user.id !== userToRemove.id));
  };

  const renderedInitialUsersList = initialUsers.map((u) => {
    return (
      <UsersListActionsItem
        key={u.id}
        user={u}
        onSelectedUsersChanged={onSelectedUsersChangedAdd}
      ></UsersListActionsItem>
    );
  });

  const renderedSelectedUsersList = selectedUsers.map((user) => {
    return (
      <UsersListActionsItem
        key={user.id}
        user={user}
        onSelectedUsersChanged={onSelectedUsersChangedRemoved}
      ></UsersListActionsItem>
    );
  });

  const saveDataClicked = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (canSave) {
      try {
        setRequestStatus(StatusData.loading);

        const resultOfAddNewUser = await dispatch(
          fetchAddGroupAsync({
            group: { name, description, userIds: selectedUsers.map((u) => u.id) },
          })
        );

        const result = unwrapResult(resultOfAddNewUser);

        setShowMessage(result.message);
        setShowAlert(true);
      } catch (err) {
        console.error("Failed to save the group", err);
      } finally {
        setRequestStatus(StatusData.idle);
      }
    }
  };

  return (
    <React.Fragment>
      <Form autoComplete="off" className="mb-3">
        <Form.Group className="mb-3" controlId="name-input">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} onChange={onNameChanged} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description-area">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={onDescriptionChanged}
          />
        </Form.Group>

        <Row>
          <Col>
            <Row>
              <Col>Select users</Col>
            </Row>
            <Row>
              <Col>{renderedInitialUsersList}</Col>
            </Row>
          </Col>

          <Col>
            <Row>
              <Col>Remove selected users</Col>
            </Row>
            <Row>
              <Col>{renderedSelectedUsersList}</Col>
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-end">
          <Col className="col-auto">
            {" "}
            <Button
              disabled={!canSave}
              onClick={saveDataClicked}
              variant="outline-primary"
              type="submit"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      <Alert show={showAlert} variant="success">
        <p>{showMessage}</p>
      </Alert>
    </React.Fragment>
  );
};

export const UsersListActionsItem = ({
  user,
  onSelectedUsersChanged,
}: {
  user: User;
  onSelectedUsersChanged: (userId: User) => void;
}) => {
  return (
    <ListGroup.Item onClick={() => onSelectedUsersChanged(user)}>{user.username}</ListGroup.Item>
  );
};
