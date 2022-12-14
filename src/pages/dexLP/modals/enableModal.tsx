import IconPair from "../components/iconPair";
import useModals, { ModalType } from "../hooks/useModals";
import { getRouterAddress, useSetAllowance } from "../hooks/useTransactions";
import { UserLPPairInfo } from "../config/interfaces";
import { PrimaryButton, Text } from "global/packages/src";
import { getEnableButtonTextAndOnClick } from "../utils/modalButtonParams";
import { DexModalContainer } from "../components/Styled";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";

interface AddAllowanceProps {
  pair: UserLPPairInfo;
  chainId: number | undefined;
  addAllowance1: (router: string, amount: string) => void;
  addAllowance2: (router: string, amount: string) => void;
}

const AddAllowanceButton = (props: AddAllowanceProps) => {
  const routerAddress = getRouterAddress(props.chainId);
  const [buttonText, buttonOnclick] = getEnableButtonTextAndOnClick(
    props.pair.basePairInfo.token1.symbol,
    props.pair.basePairInfo.token2.symbol,
    props.pair.allowance.token1,
    props.pair.allowance.token2,
    () =>
      props.addAllowance1(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    () =>
      props.addAllowance2(
        routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
  );

  return <PrimaryButton onClick={buttonOnclick}>{buttonText}</PrimaryButton>;
};

const RemoveAllowanceButton = (props: AddAllowanceProps) => {
  const routerAddress = getRouterAddress(props.chainId);
  return (
    <PrimaryButton
      onClick={() => {
        props.addAllowance1(
          routerAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      }}
    >
      enable {props.pair.basePairInfo.token1.symbol}/
      {props.pair.basePairInfo.token2.symbol}_LP
    </PrimaryButton>
  );
};

interface Props {
  activePair: UserLPPairInfo;
  onClose: () => void;
  chainId?: number;
  account?: string;
}

const EnableModal = ({ activePair, chainId, onClose }: Props) => {
  const { state: addAllowanceA, send: addAllowanceASend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: activePair.basePairInfo.token1.address,
    amount: "-1",
    icon: activePair.basePairInfo.token1.icon,
    name: activePair.basePairInfo.token1.symbol,
  });
  const { state: addAllowanceB, send: addAllowanceBSend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: activePair.basePairInfo.token2.address,
    amount: "-1",
    icon: activePair.basePairInfo.token2.icon,
    name: activePair.basePairInfo.token2.symbol,
  });
  const { state: addLPAllowance, send: addLPAllowanceSend } = useSetAllowance({
    type: CantoTransactionType.ENABLE,
    address: activePair.basePairInfo.address,
    amount: "-1",
    // TODO? : needs access of iconpair
    icon: activePair.basePairInfo.token1.icon,
    name:
      activePair.basePairInfo.token1.symbol +
      "/" +
      activePair.basePairInfo.token2.symbol,
  });

  const prevModalType = useModals((state) => state.prevModalType);
  return (
    <DexModalContainer>
      {addAllowanceA.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          status={addAllowanceA.status}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          txHash={addAllowanceA.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      )}
      {addAllowanceB.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          status={addAllowanceB.status}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          txHash={addAllowanceB.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      )}
      {addLPAllowance.status != "None" && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.ENABLE}
          status={addLPAllowance.status}
          tokenName={
            activePair.basePairInfo.token1.symbol +
            " / " +
            activePair.basePairInfo.token2.symbol
          }
          txHash={addLPAllowance.transaction?.hash}
          onClose={onClose}
          mixPanelEventInfo={{
            tokenName:
              activePair.basePairInfo.token1.symbol +
              " / " +
              activePair.basePairInfo.token2.symbol,
          }}
        />
      )}
      <div className="title">
        <Text type="title" align="left" size="title3">
          Enable Token
        </Text>
      </div>
      <div className="content">
        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <IconPair
            iconLeft={activePair.basePairInfo.token1.icon}
            iconRight={activePair.basePairInfo.token2.icon}
          />
        </div>
        <Text
          type="text"
          align="left"
          size="title3"
          style={{
            padding: "2rem",
            textAlign: "center",
            height: "100%",
          }}
        >
          Your tokens need to be enabled in order to transfer them to canto LP
          interface
        </Text>
      </div>

      <div
        style={{
          paddingBottom: "3rem",
        }}
      >
        {prevModalType == ModalType.ADD ? (
          <AddAllowanceButton
            pair={activePair}
            chainId={chainId}
            addAllowance1={addAllowanceASend}
            addAllowance2={addAllowanceBSend}
          />
        ) : (
          <RemoveAllowanceButton
            pair={activePair}
            chainId={chainId}
            addAllowance1={addLPAllowanceSend}
            addAllowance2={addAllowanceASend}
          />
        )}
      </div>
    </DexModalContainer>
  );
};

export default EnableModal;
