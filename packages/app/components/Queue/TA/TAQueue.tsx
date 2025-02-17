import { QuestionStatusKeys, Role } from "@koh/common";
import { Tooltip } from "antd";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { useCourse } from "../../../hooks/useCourse";
import { useProfile } from "../../../hooks/useProfile";
import { useQuestions } from "../../../hooks/useQuestions";
import { useQueue } from "../../../hooks/useQueue";
import { useRoleInCourse } from "../../../hooks/useRoleInCourse";
import { useTAInQueueInfo } from "../../../hooks/useTAInQueueInfo";
import TACheckinButton from "../../Today/TACheckinButton";
import {
  QueueInfoColumn,
  QueueInfoColumnButton,
} from "../QueueListSharedComponents";
import { EditQueueModal } from "./EditQueueModal";
import onHelpQuestion from "./onHelpQuestion";
import TAQueueListDetail from "./TAQueueListDetail";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  @media (min-width: 650px) {
    flex-direction: row;
  }
`;

const HelpNextButton = styled(QueueInfoColumnButton)`
  color: white;
  background: #2a9187;
  &:hover,
  &:focus {
    color: white;
    background: #39aca1;
  }
`;

const EditQueueButton = styled(QueueInfoColumnButton)`
  color: #212934;
`;

const MiddleSpacer = styled.div`
  margin-left: 20px;
`;

interface TAQueueProps {
  qid: number;
  courseId: number;
}

export default function TAQueue({ qid, courseId }: TAQueueProps): ReactElement {
  const user = useProfile();
  const role = useRoleInCourse(courseId);
  const { queue } = useQueue(qid);

  const { questions, mutateQuestions } = useQuestions(qid);

  const { isCheckedIn, isHelping } = useTAInQueueInfo(qid);

  const [queueSettingsModal, setQueueSettingsModal] = useState(false);

  const { course } = useCourse(courseId);
  const staffCheckedIntoAnotherQueue = course?.queues.some(
    (q) =>
      q.id !== qid &&
      q.staffList.some((staffMember) => staffMember.id === user?.id)
  );

  const nextQuestion =
    questions?.priorityQueue[0] || // gets the first item of priority queue if it exists
    questions?.queue?.find(
      (question) => question.status === QuestionStatusKeys.Queued
    );

  const helpNext = async () => {
    await onHelpQuestion(nextQuestion.id);
    mutateQuestions();
    window.open(
      `https://teams.microsoft.com/l/chat/0/0?users=${nextQuestion.creator.email}`
    );
  };

  // TODO: figure out tooltips
  if (queue) {
    return (
      <>
        <Container>
          <QueueInfoColumn
            queueId={qid}
            buttons={
              <>
                <EditQueueButton
                  data-cy="editQueue"
                  onClick={() => setQueueSettingsModal(true)}
                >
                  Edit Queue Details
                </EditQueueButton>
                <Tooltip
                  title={!isCheckedIn && "You must check in to help students!"}
                >
                  <HelpNextButton
                    onClick={helpNext}
                    disabled={!isCheckedIn || !nextQuestion || isHelping}
                    data-cy="help-next"
                  >
                    Help Next
                  </HelpNextButton>
                </Tooltip>
                <div style={{ marginBottom: "12px" }}>
                  <TACheckinButton
                    courseId={courseId}
                    room={queue?.room}
                    disabled={
                      staffCheckedIntoAnotherQueue ||
                      isHelping ||
                      (queue.isProfessorQueue && role !== Role.PROFESSOR)
                    }
                    state={isCheckedIn ? "CheckedIn" : "CheckedOut"}
                    block
                  />
                </div>
              </>
            }
          />
          <MiddleSpacer />
          {user && questions && (
            <TAQueueListDetail queueId={qid} courseId={courseId} />
          )}
        </Container>
        <EditQueueModal
          queueId={qid}
          visible={queueSettingsModal}
          onClose={() => setQueueSettingsModal(false)}
        />
      </>
    );
  } else {
    return <div />;
  }
}
