import { Button, Col, Row } from "react-bootstrap";
import { EntityId } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectGroupById, selectGroupsIds } from "./groupsSlice";
import { ContentList } from "../shared/ContentList";
import { entityExcerptProps } from "../shared/types";
import { fetchGroupsAsync } from "./groupThunks";
import { TableHeader } from "../shared/TableHeaders";

import { useToSelectOfFetchGroupsIds } from "./GroupHooks";

export const Groups = () => {
  const { groupIds } = useToSelectOfFetchGroupsIds({ selectGroupsIds, fetchGroupsAsync });
  const userTableHeaders = [
    { title: "№" },
    { title: "Name" },
    { title: "Description" },
    { title: "Members" },
    { title: "Actions" },
  ];

  return (
    <ContentList
      entityIds={groupIds}
      linkPath="/groups/addGroup"
      linkText="add group"
      renderGetHeaders={() => (
        <TableHeader
          headers={userTableHeaders}
          rowClassName={`row-cols-${userTableHeaders.length}`}
        ></TableHeader>
      )}
      renderGetEntities={(key: React.Key, entityId: EntityId, index: number) => {
        return <GroupExcerpt key={key} entityId={entityId} index={index}></GroupExcerpt>;
      }}
    ></ContentList>
  );
};

const GroupExcerpt = ({ entityId, index }: entityExcerptProps) => {
  const group = useAppSelector((state) => selectGroupById(state, entityId));

  return (
    <Row className="mb-1 row-cols-5 justify-content-between">
      <Col className="col-auto">{index + 1}</Col>
      <Col className="d-flex justify-content-end">{group?.name}</Col>
      <Col className="d-flex justify-content-end">{group?.description}</Col>
      <Col className="d-flex justify-content-end">
        {group?.userIds?.length ? group.userIds?.length : "empty group"}
      </Col>
      <Col className="d-flex justify-content-end">
        <Button variant="outline-secondary" className="align-self-start flex-shrink-0">
          <Link className="link" to={`/groups/editGroup/${group?.id}`}>
            edit group
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
