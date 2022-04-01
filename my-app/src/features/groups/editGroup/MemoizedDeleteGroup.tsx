import React, { useMemo } from "react";
import { NavigateFunction } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { AppDispatch } from "../../../app/store";
import { fetchDeleteGroupAsync } from "../groupThunks";
import { Group } from "../types";

export const useGroupToGetMemoizedDeleteComponent = ({
  group,
  dispatch,
  navigate,
}: {
  group: Group;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
}) => {
  const deleteGroupRenderedMemo = useMemo(
    function getDeleteGroupRenderedComponent() {
      if (!group?.userIds?.length) {
        return (
          <Row>
            <Col>You can delete this group</Col>
            <Col>
              <Button
                variant="outline-danger"
                onClick={() => {
                  dispatch(fetchDeleteGroupAsync({ groupId: group.id }));
                  navigate("/groups");
                }}
              >
                delete
              </Button>
            </Col>
          </Row>
        );
      } else {
        return (
          <Row>
            <Col>You can't delete this group. Some users have been assigned to this group</Col>
          </Row>
        );
      }
    },
    [group, dispatch, navigate]
  );

  return deleteGroupRenderedMemo;
};
