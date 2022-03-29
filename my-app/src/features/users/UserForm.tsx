import React, { useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { StatusData } from "./types";
import { Alert } from "react-bootstrap";

export function UserFormWrapper({
  isEditing,
  titleMessage,
  username,
  setUserName,
  handleAsyncThunkAction,
}: {
  isEditing: boolean;
  titleMessage: string;
  username: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  handleAsyncThunkAction: any;
}) {
  const [addRequestStatus, setAddRequestStatus] = useState(StatusData.idle);

  const canSave = Boolean(username) && addRequestStatus === StatusData.idle;

  const [showUserAlert, setShowUserAlert] = useState(false);
  const [showUserMessage, setShowUserMessage] = useState("");

  const onUserNameChanged = (event: any) => {
    setShowUserAlert(false);
    setShowUserMessage("");
    setUserName(event.target.value);
  };

  const saveDataClicked = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus(StatusData.loading);

        const resultOfAddNewUser = await handleAsyncThunkAction({ username });

        const result = unwrapResult(resultOfAddNewUser);

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
  canSave,
  saveDataClicked,
}: {
  username: string;
  onUserNameChanged: (event: any) => void;
  canSave: boolean;
  saveDataClicked: (event: any) => void;
}) => {
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
