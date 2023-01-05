import { OutlinedButton, PrimaryButton } from "global/packages/src";

interface WaitProps {
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  txHash: string | undefined;
  canGoBack: boolean;
}
export const WaitForGbridge = (props: WaitProps) => {
  return (
    <>
      <h1>wait for gbridge</h1>{" "}
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.onPrev} disabled={!props.canGoBack}>
            Prev
          </OutlinedButton>
          <PrimaryButton onClick={props.onNext} disabled={false}>
            Next
          </PrimaryButton>
        </div>
      </footer>
    </>
  );
};