import { useState } from "react";
import { UserFormWrapper } from "./UserForm";
import { useAppDispatch } from "../../app/hooks";
import { CreateUserRequest, fetchAddUserAsync, UserUpdateRequest } from "./userThunks";
import { Group } from "../groups/types";

export const AddUserForm = () => {
  const dispatch = useAppDispatch();

  const [username, setUserName] = useState("");
  const [groupId, setGroupId] = useState<Group["id"]>("");

  const handleAsyncThunkAction = async ({
    username,
    groupId,
  }: CreateUserRequest | UserUpdateRequest) => {
    let addUserReq = { username } as CreateUserRequest;
    if (groupId) {
      addUserReq = { ...addUserReq, groupId };
    }
    const result = await dispatch(fetchAddUserAsync(addUserReq));
    return result;
  };

  return (
    <UserFormWrapper
      isEditing={false}
      titleMessage="Add a new user"
      username={username}
      setUserName={setUserName}
      groupId={groupId}
      setGroupId={setGroupId}
      handleAsyncThunkAction={handleAsyncThunkAction}
    ></UserFormWrapper>
  );
};
