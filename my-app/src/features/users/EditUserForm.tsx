import { useEffect, useState } from "react";
import { EntityState, EntityId, AsyncThunk } from "@reduxjs/toolkit";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "./../../app/hooks";
import { User } from "./types";
import { UsersState } from "./usersSlice";
import {
  fetchUpdateUsersAsync,
  fetchUsersByIdAsync,
  fetchDeleteUsersAsync,
  CreateUserRequest,
  UserUpdateRequest,
} from "./userThunks";
import { selectUserById } from "./usersSlice";
import { UserFormWrapper } from "./UserForm";
import { Group } from "../groups/types";

import { RootState } from "../../app/store";

export const useUserIdToSelectOrFetchUser = ({
  userId,
  selectUserById,
  fetchUsersByIdAsync,
}: {
  userId: string;
  selectUserById: (state: RootState, id: EntityId) => User | undefined;
  fetchUsersByIdAsync: AsyncThunk<
    any,
    {
      userId: string;
    },
    {}
  >;
}) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => selectUserById(state, userId));

  useEffect(() => {
    if (!user) {
      dispatch(fetchUsersByIdAsync({ userId }));
    }
  }, [userId, dispatch, user, fetchUsersByIdAsync]);

  return user;
};

export const EditUserFormParamGetter = () => {
  const { userId } = useParams();
  if (!userId) return null;

  return <EditUserFormWrapper userId={userId}></EditUserFormWrapper>;
};
export const EditUserFormWrapper = ({ userId }: { userId: string }) => {
  const user = useUserIdToSelectOrFetchUser({ userId, selectUserById, fetchUsersByIdAsync });

  if (!user) {
    return (
      <section>
        <h2>User with id {userId} is not found</h2>
      </section>
    );
  }

  return <EditUserForm user={user}></EditUserForm>;
};

export const EditUserForm = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [username, setUserName] = useState(user.username);
  const [groupId, setGroupId] = useState<Group["id"]>(user?.groupId ? user.groupId : "");

  const handleAsyncThunkAction = async ({
    username,
    groupId,
  }: CreateUserRequest | UserUpdateRequest) => {
    let userToUpdate = { id: user.id, username, groupId } as UserUpdateRequest;

    const result = await dispatch(fetchUpdateUsersAsync({ user: userToUpdate }));
    return result;
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
