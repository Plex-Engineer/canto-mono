import { OutlinedButton, PrimaryButton } from "global/packages/src";
import { BaseToken } from "pages/bridge/config/interfaces";

interface ConfirmationProps {
  token: BaseToken;
  amount: string;
  txType: string;
  onTxConfirm: () => void;
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  canGoBack: boolean;
}
export const ConfirmTransactionPage = (props: ConfirmationProps) => {
  return (
    <>
      <p>{props.txType}</p>
      <p>token: {props.token.name}</p>
      <p>amount: {props.amount}</p>
      <PrimaryButton disabled={props.canContinue} onClick={props.onTxConfirm}>
        Confirm
      </PrimaryButton>
      <footer>
        <div className="row">
          <OutlinedButton disabled={!props.canGoBack} onClick={props.onPrev}>
            Prev
          </OutlinedButton>
          <PrimaryButton disabled={!props.canContinue} onClick={props.onNext}>
            Next
          </PrimaryButton>
        </div>
      </footer>
    </>
  );
};