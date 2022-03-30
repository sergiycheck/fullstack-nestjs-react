import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { EntityId } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { TimeAgo } from "../shared/TimeAgo";
import { selectUserById, selectUserIds } from "./usersSlice";
import "./Users.scss";
import { ContentList } from "../shared/ContentList";
import { entityExcerptProps } from "../shared/types";
import { TableHeader } from "../shared/TableHeaders";

export const Users = () => {
  const usersIds = useAppSelector(selectUserIds);
  const userTableHeaders = ["№", "Username", "Created", "Actions"];

  return (
    <ContentList
      entityIds={usersIds}
      linkPath="users/addUser"
      linkText="add user"
      renderGetHeaders={() => <TableHeader headers={userTableHeaders}></TableHeader>}
      renderGetEntities={(key: React.Key, entityId: EntityId, index: number) => {
        return <UserExcerpt key={key} entityId={entityId} index={index}></UserExcerpt>;
      }}
    ></ContentList>
  );
};

export const UserExcerpt = ({ entityId, index }: entityExcerptProps) => {
  const user = useAppSelector((state) => selectUserById(state, entityId));

  return (
    <Row className="mb-1">
      <Col>{index + 1}</Col>
      <Col>{user?.username}</Col>
      <Col>
        <TimeAgo timeStamp={user?.created}></TimeAgo>
      </Col>
      <Col>
        <Button variant="outline-secondary">
          <Link className="link" to={`users/editUser/${user?.id}`}>
            edit user
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
