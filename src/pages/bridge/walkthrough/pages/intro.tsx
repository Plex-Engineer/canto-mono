import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import TextSwitch from "../components/TextSwitch";
import BaseStyled from "./layout";

interface IntroPageProps {
  setBridgeType: (type: "IN" | "OUT" | "NONE") => void;
  currentBridgeType: "IN" | "OUT" | "NONE";
  canSkip: boolean;
  setSkipDecision: (skip: boolean) => void;
  currentSkipDecision: boolean;
  onNext: () => void;
  canBridgeIn: boolean;
  canBridgeOut: boolean;
}
const IntroPage = (props: IntroPageProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Getting Started
        </Text>
        <Text type="text" size="title3">
          What would you like to do ?
        </Text>
      </header>
      <section>
        <div className="row">
          <TextSwitch
            text="get funds into canto"
            active={props.currentBridgeType == "IN"}
            onClick={() => {
              props.setBridgeType("IN");
            }}
            disabled={!props.canBridgeIn}
          />
          <TextSwitch
            text="get funds out of canto"
            active={props.currentBridgeType == "OUT"}
            onClick={() => props.setBridgeType("OUT")}
            disabled={!props.canBridgeOut}
          />
        </div>

        {props.canSkip && props.currentBridgeType != "NONE" && (
          <>
            <Text type="text" size="title3">
              {props.currentBridgeType == "IN"
                ? "Has your gravity Bridge transaction completed ?"
                : "Have you already sent funds to the canto bridge ?"}
            </Text>
            <div className="row">
              <TextSwitch
                text="no"
                active={!props.currentSkipDecision}
                onClick={() => {
                  props.setSkipDecision(false);
                }}
                disabled={false}
              />
              <TextSwitch
                text="yes"
                active={props.currentSkipDecision}
                onClick={() => props.setSkipDecision(true)}
                disabled={false}
              />
            </div>
          </>
        )}
      </section>
      <footer>
        <div className="row">
          <OutlinedButton disabled>Prev</OutlinedButton>
          <PrimaryButton
            disabled={props.currentBridgeType == "NONE"}
            onClick={props.onNext}
          >
            Next
          </PrimaryButton>
        </div>
      </footer>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
`;

export default IntroPage;
