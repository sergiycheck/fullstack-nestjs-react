import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "./../../app/hooks";
import { User } from "./types";
import {
  fetchUpdateUserAndRemoveItIdFromGroup,
  fetchUpdateUserAndAddItIdToGroup,
  fetchUpdateUserAnMoveItIdToOtherGroup,
  fetchUpdateUsersAsync,
  fetchUserByIdAsync,
  fetchDeleteUsersAsync,
  CreateUserRequest,
  UserUpdateRequest,
} from "./userThunks";
import { selectUserById } from "./usersSlice";
import { UserFormWrapper } from "./UserForm";

import { useUserIdToSelectOrFetchUser } from "./UserHooks";
import { selectGroupById } from "../groups/groupsSlice";

export const EditUserFormParamGetter = () => {
  const { userId } = useParams();
  if (!userId) return null;

  return <EditUserFormWrapper userId={userId}></EditUserFormWrapper>;
};
export const EditUserFormWrapper = ({ userId }: { userId: string }) => {
  const user = useUserIdToSelectOrFetchUser({ userId, selectUserById, fetchUserByIdAsync });

  if (!user) {
    return (
      <section>
        <h2>User with id {userId} is not found</h2>
      </section>
    );
  }

  return <EditUserForm user={user}></EditUserForm>;
};

//TODO: add leave group feature
export const EditUserForm = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [username, setUserName] = useState(user.username);
  const [groupId, setGroupId] = useState(user?.groupId ? user.groupId : "");

  const userOldGroup = useAppSelector((state) =>
    selectGroupById(state, user?.groupId ? user.groupId : "")
  );

  const handleAsyncThunkAction = async ({
    username,
    groupId,
  }: CreateUserRequest | UserUpdateRequest) => {
    let userToUpdate = { id: user.id, username } as UserUpdateRequest;

    if (groupId) {
      userToUpdate = { ...userToUpdate, groupId };
    } else {
      userToUpdate = { ...userToUpdate, groupId: null };
    }

    let unwrapedResult;

    if (userOldGroup && groupId && groupId !== userOldGroup.id) {
      // user has group and selected other group
      //move user from old group to new group
      unwrapedResult = await dispatch(
        fetchUpdateUserAnMoveItIdToOtherGroup(userToUpdate, userOldGroup)
      );
    } else if (userOldGroup && !groupId) {
      //user is in group but selected no group. remove user from old group
      unwrapedResult = await dispatch(
        fetchUpdateUserAndRemoveItIdFromGroup(userToUpdate, userOldGroup)
      );
    } else if (!userOldGroup && groupId) {
      //user is not in group and selected an group. add user to the group
      unwrapedResult = await dispatch(fetchUpdateUserAndAddItIdToGroup(userToUpdate));
    } else if ((!userOldGroup && !groupId) || (userOldGroup && userOldGroup.id === groupId)) {
      //user has not changed group
      unwrapedResult = await dispatch(fetchUpdateUsersAsync({ user: userToUpdate })).unwrap();
    }

    return unwrapedResult;
  };

  return (
    <Row>
      <Row>
        <Col>
          <UserFormWrapper
            isEditing={true}
            titleMessage="Edit user"
            username={username}
            groupId={groupId}
            setGroupId={setGroupId}
            setUserName={setUserName}
            handleAsyncThunkAction={handleAsyncThunkAction}
          ></UserFormWrapper>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>You can also delete user</Col>
            <Col>
              {" "}
              <Button
                variant="outline-danger"
                onClick={() => {
                  dispatch(fetchDeleteUsersAsync({ userId: user.id }));
                  navigate("/");
                }}
              >
                delete
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Row>
  );
};
