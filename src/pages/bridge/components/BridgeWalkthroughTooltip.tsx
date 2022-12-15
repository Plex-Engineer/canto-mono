import { OutlinedButton, PrimaryButton } from "global/packages/src";
import { TooltipRenderProps } from "react-joyride";
import { useTransactionChecklistStore } from "../stores/transactionChecklistStore";
export const BridgeWalkthroughTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) => {
  const currentChecklistStep =
    useTransactionChecklistStore().getCurrentBridgeOutTx()?.currentStep;
  return (
    <div {...tooltipProps}>
      <div style={{ ...step.styles?.tooltipContainer }}>
        <div style={{ ...step.styles?.tooltip }}>
          <div>{step.title}</div>
          <div>{step.content}</div>
          <div style={{ ...step.styles?.tooltipFooter }}>
            {index != 0 && <OutlinedButton {...backProps}>prev</OutlinedButton>}
            <PrimaryButton
              disabled={
                currentChecklistStep ? currentChecklistStep < index + 1 : true
              }
              {...primaryProps}
            >
              next
            </PrimaryButton>
            <button style={{ ...step.styles?.buttonClose }} {...closeProps}>
              x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
