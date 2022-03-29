import { useState } from "react";
import { UserFormWrapper } from "./UserForm";
import { useAppDispatch } from "../../app/hooks";
import { fetchAddUserAsync } from "./userThunks";

export const AddUserForm = () => {
  const dispatch = useAppDispatch();

  const [username, setUserName] = useState("");

  const handleAsyncThunkAction = async ({ username }: { username: string }) => {
    const result = await dispatch(fetchAddUserAsync({ username }));
    return result;
  };

  return (
    <UserFormWrapper
      isEditing={false}
      titleMessage="Add a new user"
      username={username}
      setUserName={setUserName}
      handleAsyncThunkAction={handleAsyncThunkAction}
    ></UserFormWrapper>
  );
};
