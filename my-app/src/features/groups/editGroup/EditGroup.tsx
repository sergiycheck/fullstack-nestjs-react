import React, { useState, useMemo, useEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { Form, Alert, Button, Row, Col } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AppDispatch } from "../../../app/store";
import { StatusData } from "../../shared/types";
import { selectUsersStatus } from "../../users/usersSlice";
import { useGroupIdToSelectOrFetchGroup } from "../GroupHooks";
import { selectGroupById } from "../groupsSlice";
import { fetchDeleteGroupAsync, fetchGroupByIdAsync, fetchUpdateGroupsAsync } from "../groupThunks";
import { Group } from "../types";

import { fetchUsersAsync } from "../../users/userThunks";

import { RemoveUsersComponent } from "./RemoveUsersComponent";
import { logm } from "../../../app/middewares";

export const EditGroupFormParamGetter = () => {
  const { groupId } = useParams();
  if (!groupId) return null;

  return <EditGroupFormWrapper groupId={groupId}></EditGroupFormWrapper>;
};

export const EditGroupFormWrapper = ({ groupId }: { groupId: string }) => {
  const group = useGroupIdToSelectOrFetchGroup({ groupId, selectGroupById, fetchGroupByIdAsync });

  if (!group) {
    return (
      <section>
        <h2>Group with id {groupId} is not found</h2>
      </section>
    );
  }

  return <EditGroup group={group}></EditGroup>;
};

export const useGroupToGetMemoizedDeleteComponent = ({
  group,
  dispatch,
  navigate,
}: {
  group: Group;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
}) => {
  const deleteGroupRenderedMemo = useMemo(
    function getDeleteGroupRenderedComponent() {
      if (!group?.userIds?.length) {
        return (
          <Row>
            <Col>You can delete this group</Col>
            <Col>
              <Button
                variant="outline-danger"
                onClick={() => {
                  dispatch(fetchDeleteGroupAsync({ groupId: group.id }));
                  navigate("/groups");
                }}
              >
                delete
              </Button>
            </Col>
          </Row>
        );
      } else {
        return (
          <Row>
            <Col>You can't delete this group. Some users have been assigned to this group</Col>
          </Row>
        );
      }
    },
    [group, dispatch, navigate]
  );

  return deleteGroupRenderedMemo;
};

//TODO: memory leak on edit group users
export const EditGroup = ({ group }: { group: Group }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [requestStatus, setRequestStatus] = useState(StatusData.idle);

  logm("group ", group);

  const usersStatus = useAppSelector(selectUsersStatus);
  useEffect(() => {
    if (usersStatus === StatusData.idle) {
      dispatch(fetchUsersAsync());
    }
  }, [usersStatus, dispatch]);

  const canSave = Boolean(name) && Boolean(description) && requestStatus === StatusData.idle;

  const [showAlert, setShowAlert] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  const resetAlertAndMessage = () => {
    setShowAlert(false);
    setShowMessage("");
  };

  const onNameChanged = (event: any) => {
    setName(event.currentTarget.value);
    resetAlertAndMessage();
  };

  const onDescriptionChanged = (event: any) => {
    setDescription(event.currentTarget.value);
    resetAlertAndMessage();
  };

  const saveDataClicked = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (canSave) {
      try {
        setRequestStatus(StatusData.loading);

        const result = await dispatch(
          fetchUpdateGroupsAsync({ id: group.id, name, description })
        ).unwrap();

        setShowMessage(result.message);
        setShowAlert(true);
      } catch (err) {
        console.error("Failed to save the group", err);
      } finally {
        setRequestStatus(StatusData.idle);
      }
    }
  };

  const deleteGroupRenderedMemo = useGroupToGetMemoizedDeleteComponent({
    group,
    dispatch,
    navigate,
  });

  return (
    <Row>
      <Row>
        <Col>
          {" "}
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
        </Col>
      </Row>

      <Row>
        <Col>
          <Alert show={showAlert} variant="success">
            <p>{showMessage}</p>
          </Alert>
        </Col>
      </Row>

      <RemoveUsersComponent usersIds={group.userIds} groupId={group.id}></RemoveUsersComponent>

      {deleteGroupRenderedMemo}
    </Row>
  );
};
