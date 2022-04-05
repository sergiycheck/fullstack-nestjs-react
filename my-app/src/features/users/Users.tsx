import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { EntityId } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { TimeAgo } from "../shared/TimeAgo";
import { selectUserById, selectUserIds } from "./usersSlice";
import { ContentList } from "../shared/ContentList";
import { entityExcerptProps } from "../shared/types";
import { TableHeader } from "../shared/TableHeaders";
import { useToSelectOfFetchUserIds } from "./UserHooks";
import { fetchUsersAsync } from "./userThunks";

export const Users = () => {
  const { entityIds: usersIds } = useToSelectOfFetchUserIds({ selectUserIds, fetchUsersAsync });
  const userTableHeaders = [
    { title: "№" },
    { title: "Username" },
    { title: "Group" },
    { title: "Created", classes: "d-none d-md-flex" },
    { title: "Actions" },
  ];

  return (
    <ContentList
      entityIds={usersIds}
      linkPath="users/addUser"
      linkText="add user"
      renderGetHeaders={() => (
        <TableHeader
          headers={userTableHeaders}
          rowClassName={`row-cols-${userTableHeaders.length}`}
        ></TableHeader>
      )}
      renderGetEntities={(key: React.Key, entityId: EntityId, index: number) => {
        return <UserExcerpt key={key} entityId={entityId} index={index}></UserExcerpt>;
      }}
    ></ContentList>
  );
};

export const UserExcerpt = ({ entityId, index }: entityExcerptProps) => {
  const user = useAppSelector((state) => selectUserById(state, entityId));

  return (
    <Row className="mb-1 row-cols-5 justify-content-between">
      <Col className="col-auto">{index + 1}</Col>
      <Col className="d-flex justify-content-end">{user?.username}</Col>
      <Col className="d-flex justify-content-end">{user?.groupName}</Col>
      <Col className="d-none d-md-flex justify-content-end">
        <TimeAgo timeStamp={user?.created}></TimeAgo>
      </Col>
      <Col className="d-flex justify-content-end">
        <Button variant="outline-secondary" className="align-self-start flex-shrink-0">
          <Link className="link" to={`users/editUser/${user?.id}`}>
            edit user
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
