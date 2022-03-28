import React, { useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { UserForm } from "./UserForm";
import { useAppDispatch } from "../../app/hooks";
import { StatusData } from "./types";
import { fetchAddUserAsync } from "./userThunks";
import { Alert } from "react-bootstrap";

export const AddUserForm = () => {
  const dispatch = useAppDispatch();

  const [username, setUserName] = useState("");

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

        const resultOfAddNewUser = await dispatch(fetchAddUserAsync({ username }));

        const result = unwrapResult(resultOfAddNewUser);

        setShowUserMessage(result.message);
        setShowUserAlert(true);
        setUserName("");
      } catch (err) {
        console.error("Failed to save the user", err);
      } finally {
        setAddRequestStatus(StatusData.idle);
      }
    }
  };

  return (
    <React.Fragment>
      <h2>Add a new user</h2>

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
};
