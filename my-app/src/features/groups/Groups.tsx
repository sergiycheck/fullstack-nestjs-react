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
  const userTableHeaders = ["№", "Name", "Description", "Members", "Actions"];

  return (
    <ContentList
      entityIds={groupIds}
      linkPath="/groups/addGroup"
      linkText="add group"
      renderGetHeaders={() => <TableHeader headers={userTableHeaders}></TableHeader>}
      renderGetEntities={(key: React.Key, entityId: EntityId, index: number) => {
        return <GroupExcerpt key={key} entityId={entityId} index={index}></GroupExcerpt>;
      }}
    ></ContentList>
  );
};

const GroupExcerpt = ({ entityId, index }: entityExcerptProps) => {
  const group = useAppSelector((state) => selectGroupById(state, entityId));

  return (
    <Row className="mb-1">
      <Col>{index + 1}</Col>
      <Col>{group?.name}</Col>
      <Col>{group?.description}</Col>
      {/* TODO: update group.userIds.length on user edit asynchronously */}
      <Col>{group?.userIds?.length ? group.userIds?.length : "empty group"}</Col>
      <Col>
        <Button variant="outline-secondary">
          <Link className="link" to={`/groups/editGroup/${group?.id}`}>
            edit group
          </Link>
        </Button>
      </Col>
    </Row>
  );
};
