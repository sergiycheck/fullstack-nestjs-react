import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./../../app/hooks";
import { EntityState, EntityId, AsyncThunk } from "@reduxjs/toolkit";
import { User } from "./types";
import { UsersState } from "./usersSlice";
import { fetchUpdateUsersAsync, fetchUsersByIdAsync, fetchDeleteUsersAsync } from "./userThunks";
import { selectUserById } from "./usersSlice";
import { UserFormWrapper } from "./UserForm";
import { Button, Col, Row } from "react-bootstrap";

export const useUserIdToSelectOrFetchUser = ({
  userId,
  selectUserById,
  fetchUsersByIdAsync,
}: {
  userId: string;
  selectUserById: (
    state: {
      users: EntityState<User> & UsersState;
    },
    id: EntityId
  ) => User | undefined;
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

  const handleAsyncThunkAction = async ({ username }: { username: string }) => {
    const userToUpdate = { user: { id: user.id, username } };
    const result = await dispatch(fetchUpdateUsersAsync(userToUpdate));
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
