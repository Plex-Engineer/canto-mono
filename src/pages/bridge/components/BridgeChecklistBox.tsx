import styled from "@emotion/styled";
import ImageButton from "global/components/ImageButton";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { useState } from "react";
import { ChecklistTracker } from "../config/transactionChecklist";
import closeImg from "assets/icons/close.svg";
import { Mixpanel } from "mixpanel";

interface ChecklistBoxProps {
  trackerList: ChecklistTracker;
  currentStep: number;
  totalTxs: number;
  addTx: () => void;
  removeTx: () => void;
  startWalkthrough: () => void;
}
export const BridgeChecklistBox = (props: ChecklistBoxProps) => {
  const [showChecklist, setShowChecklist] = useState(false);

  const fullList = Object.keys(props.trackerList).map((keyName, i) => (
    <Text
      type="text"
      size="text3"
      key={i}
      align="left"
      className={props.currentStep == i ? "active" : ""}
      style={{
        color: i > props.currentStep ? "#414141" : "var(--primary-color)",
      }}
    >
      {/* {props.currentStep == i ? "‣ " : ""} */}
      {i + 1}
      {". "}
      {props.trackerList[Number(keyName)].label}
    </Text>
  ));
  if (!showChecklist) {
    return (
      <ClosedCheckbox
        onClick={() => {
          Mixpanel.events.bridgeActions.checklistActions.checklistOpened();
          setShowChecklist(true);
        }}
      >
        {" "}
        <Text type="text" size="text2">
          Help
        </Text>
      </ClosedCheckbox>
    );
  }
  return (
    <Styled>
      <div className="close">
        <ImageButton
          onClick={() => {
            Mixpanel.events.bridgeActions.checklistActions.checklistClosed();
            setShowChecklist(false);
          }}
          src={closeImg}
          alt="close"
          height={16}
        />
      </div>
      <Text type="title" size="title3">
        Checklist
      </Text>
      <div className="list">{fullList}</div>
      <Text type="text" size="text3">
        {"transactions tracked: " + props.totalTxs}
      </Text>
      <div className="btns">
        <PrimaryButton onClick={props.startWalkthrough}>
          Walkthrough
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            Mixpanel.events.bridgeActions.checklistActions.transactionAdded();
            props.addTx();
          }}
          height="small"
        >
          <Text type="text" size="text4" color="dark" bold>
            Add Txn
          </Text>
        </PrimaryButton>
        <OutlinedButton
          onClick={() => {
            Mixpanel.events.bridgeActions.checklistActions.transactionRemoved();
            props.removeTx();
          }}
          height="small"
        >
          <Text type="text" size="text4" bold>
            Remove Txn
          </Text>
        </OutlinedButton>
      </div>
    </Styled>
  );
};

const ClosedCheckbox = styled.div`
  width: 4rem;
  height: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  background-color: #303030;
  padding-left: 6px;
  border-radius: 2rem 0 0 2rem;
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 0.5s forwards 0.6s;
`;

const Styled = styled.div`
  position: absolute;
  right: 1.3rem;
  background-color: #151515;
  width: 18rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1rem;
  animation: fadeIn 0.5s forwards;
  z-index: 20;

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    transition: transform 0.3s;

    &:hover {
      transform: rotateZ(90deg);
    }
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    p {
      transition: all 0.5s;
    }
  }

  .active {
    color: white !important;

    &:before {
      content: "‣";
      position: absolute;
      left: 5px;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-direction: row-reverse;
  }

  @media (max-width: 1000px) {
    top: 50%;
    right: 50%;
    transform: translateX(50%) translateY(-50%);
    z-index: 20;

    /* &::after {
      content: "";
      display: block;
      position: absolute;
      height: 100vmax;
      width: 100vmin;
      top: -68%;
      left: -22%;
      background-color: #0080002a;
      z-index: 18; */
    /* } */
  }
`;
