import React, { useState } from "react";
import { EntityId } from "@reduxjs/toolkit";
import { Alert } from "react-bootstrap";
import { StatusData } from "../shared/types";
import { useToSelectOfFetchGroupsIds } from "../groups/GroupHooks";
import { selectGroupById, selectGroupsIds } from "../groups/groupsSlice";
import { fetchGroupsAsync } from "../groups/groupThunks";
import { entityExcerptProps } from "../shared/types";
import { useAppSelector } from "../../app/hooks";
import { UserUpdateRequest, CreateUserRequest } from "./types";

export function UserFormWrapper({
  isEditing,
  titleMessage,
  username,
  setUserName,
  groupId,
  setGroupId,
  handleAsyncThunkAction,
}: {
  isEditing: boolean;
  titleMessage: string;
  username: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;

  groupId: string;
  setGroupId: React.Dispatch<React.SetStateAction<string>>;
  handleAsyncThunkAction: (args: CreateUserRequest | UserUpdateRequest) => any;
}) {
  const [addRequestStatus, setAddRequestStatus] = useState(StatusData.idle);

  const { groupIds } = useToSelectOfFetchGroupsIds({ selectGroupsIds, fetchGroupsAsync });

  const canSave = Boolean(username) && addRequestStatus === StatusData.idle;

  const [showUserAlert, setShowUserAlert] = useState(false);
  const [showUserMessage, setShowUserMessage] = useState("");

  const onUserNameChanged = (event: any) => {
    setShowUserAlert(false);
    setShowUserMessage("");
    setUserName(event.target.value);
  };

  const onGroupChanged = (event: any) => {
    setGroupId(event.target.value.trim());
  };

  const saveDataClicked = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus(StatusData.loading);

        const result = await handleAsyncThunkAction({ username, groupId });

        setShowUserMessage(result.message);
        setShowUserAlert(true);

        if (!isEditing) setUserName("");
      } catch (err) {
        console.error("Failed to save the user", err);
      } finally {
        setAddRequestStatus(StatusData.idle);
      }
    }
  };

  return (
    <React.Fragment>
      <h2>{titleMessage}</h2>

      <UserForm
        username={username}
        onUserNameChanged={onUserNameChanged}
        groupId={groupId}
        groupIds={groupIds}
        onGroupChanged={onGroupChanged}
        canSave={canSave}
        saveDataClicked={saveDataClicked}
      ></UserForm>
      <Alert show={showUserAlert} variant="success">
        <p>{showUserMessage}</p>
      </Alert>
    </React.Fragment>
  );
}

export const UserForm = ({
  username,
  onUserNameChanged,

  groupId,
  groupIds,
  onGroupChanged,

  canSave,
  saveDataClicked,
}: {
  username: string;
  onUserNameChanged: (event: any) => void;

  groupId: string;
  groupIds: EntityId[];
  onGroupChanged: (event: any) => void;

  canSave: boolean;
  saveDataClicked: (event: any) => void;
}) => {
  const renderedGroupOptions = groupIds.map((entityId, index) => {
    return <GroupOptionExcerpt key={index} entityId={entityId} index={index}></GroupOptionExcerpt>;
  });

  return (
    <form className="mb-3" autoComplete="off">
      <label className="form-label" htmlFor="userName">
        Username:
      </label>
      <input
        type="text"
        id="userName"
        name="userName"
        className="form-control"
        value={username}
        onChange={onUserNameChanged}
      />

      <div className="mt-2 row gap-2 row-cols-auto">
        <div className="col">
          <label className="form-label" htmlFor="userGroup">
            user group:
          </label>
        </div>
        <div className="col">
          <select value={groupId} onChange={onGroupChanged} name="userGroup" id="userGroup">
            <option value="">No group</option>
            {renderedGroupOptions}
          </select>
        </div>
      </div>

      <div className="row justify-content-end mt-2">
        <div className="col-auto">
          <button
            className=" btn  border border-primary rounded "
            disabled={!canSave}
            onClick={saveDataClicked}
            type="button"
          >
            Save user
          </button>
        </div>
      </div>
    </form>
  );
};

export const GroupOptionExcerpt = ({ entityId }: entityExcerptProps) => {
  const group = useAppSelector((state) => selectGroupById(state, entityId));

  return <option value={group?.id}>{group?.name}</option>;
};
