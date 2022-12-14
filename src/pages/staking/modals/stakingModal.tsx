import {
  MasterValidatorProps,
  StakingTransactionType,
  TxFeeBalanceCheck,
  Validator,
} from "../config/interfaces";
import { StakingModalContainer } from "../components/Styled";
import { truncateNumber } from "global/utils/utils";
import { formatEther, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { useState } from "react";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { CantoMainnet } from "global/config/networks";
import Select from "react-select";
import useTransactionStore from "../stores/transactionStore";
import useValidatorModalStore from "../stores/validatorModalStore";
import {
  txRedelegate,
  txStake,
  txUnstake,
} from "pages/staking/utils/transactions";
import { delegateFee, unbondingFee } from "../config/fees";
import { chain, memo } from "global/config/cosmosConstants";
import { performTxAndSetStatus } from "../utils/utils";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { CInput } from "global/packages/src/components/atoms/Input";
import styled from "@emotion/styled";
import CheckBox from "global/components/checkBox";
import { ConfirmUndelegationModal } from "./confirmUndelegationModal";
import GlobalLoadingModal from "global/components/modals/loadingModal";
import { CantoTransactionType } from "global/config/transactionTypes";

interface StakingModalProps {
  validator: MasterValidatorProps;
  allValidators: Validator[];
  balance: BigNumber;
  account?: string;
  onClose: () => void;
  txFeeCheck: TxFeeBalanceCheck;
}
export const StakingModal = ({
  validator,
  allValidators,
  balance,
  account,
  onClose,
  txFeeCheck,
}: StakingModalProps) => {
  const [amount, setAmount] = useState("");
  const [agreed, setAgreed] = useState(false);
  const transactionStore = useTransactionStore();
  const validatorModalStore = useValidatorModalStore();
  const [newValidator, setNewValidator] = useState<Validator | undefined>();
  const [showUndelegateConfimation, setShowUndelegateConfirmation] =
    useState(false);

  function formatValue(value: string) {
    if (value === "" || isNaN(Number(value))) {
      return BigNumber.from(0);
    }
    return parseEther(value);
  }

  const handleDelegate = async () => {
    const parsedAmount = formatValue(amount);
    if (!parsedAmount.isZero() && parsedAmount.lte(balance)) {
      await performTxAndSetStatus(
        async () =>
          await txStake(
            account,
            validator.validator.operator_address,
            parsedAmount.toString(),
            CantoMainnet.cosmosAPIEndpoint,
            delegateFee,
            chain,
            memo
          ),
        StakingTransactionType.DELEGATE,
        transactionStore.setTransactionStatus,
        validatorModalStore.close,
        validator.validator.description.moniker,
        parsedAmount
      );
    }
  };

  const handleUndelegate = async () => {
    const parsedAmount = formatValue(amount);
    const delegatedTo = parseEther(
      validator.userDelegations?.balance.amount ?? "0"
    );
    if (!parsedAmount.isZero() && parsedAmount.lte(delegatedTo)) {
      await performTxAndSetStatus(
        async () =>
          await txUnstake(
            account,
            validator.validator.operator_address,
            parsedAmount.toString(),
            CantoMainnet.cosmosAPIEndpoint,
            delegateFee,
            chain,
            memo
          ),
        StakingTransactionType.UNDELEGATE,
        transactionStore.setTransactionStatus,
        validatorModalStore.close,
        validator.validator.description.moniker,
        parsedAmount
      );
    }
  };

  const handleRedelegate = async () => {
    const parsedAmount = formatValue(amount);
    const delegatedTo = parseEther(
      validator.userDelegations?.balance.amount ?? "0"
    );
    if (
      !parsedAmount.isZero() &&
      parsedAmount.lte(delegatedTo) &&
      newValidator
    ) {
      await performTxAndSetStatus(
        async () =>
          await txRedelegate(
            account,
            parsedAmount.toString(),
            CantoMainnet.cosmosAPIEndpoint,
            unbondingFee,
            chain,
            memo,
            validator.validator.operator_address,
            newValidator.operator_address
          ),
        StakingTransactionType.REDELEGATE,
        transactionStore.setTransactionStatus,
        validatorModalStore.close,
        validator.validator.description.moniker,
        parsedAmount,
        newValidator.description.moniker
      );
    }
  };

  return (
    <StakingModalContainer>
      {transactionStore.transactionStatus && (
        <GlobalLoadingModal
          transactionType={CantoTransactionType.STAKE}
          status={transactionStore.transactionStatus.status}
          tokenName={"staking"}
          customMessage={transactionStore.transactionStatus.message}
          onClose={onClose}
          mixPanelEventInfo={{
            StakingTransactionType: transactionStore.transactionStatus.type,
            validatorName: validator.validator.description.moniker,
            amount: amount,
          }}
        />
      )}
      <Text size="title2" type="title" className="title">
        {validator.validator.description.moniker}
      </Text>
      <div className="desc">
        <div
          style={{
            marginBottom: ".5rem",
          }}
        >
          <Text
            size="text2"
            type="text"
            align="left"
            style={{
              padding: "8px 0",
            }}
          >
            {validator.validator.description.details.toLowerCase()}{" "}
          </Text>
        </div>
        <div className="dual-h-row">
          <p className="type">delegation</p>
          <p className="value">
            {formatEther(validator.userDelegations?.balance.amount ?? 0)} canto
          </p>
        </div>
        <div className="dual-h-row">
          <p className="type">available balance</p>
          <p className="value">{truncateNumber(formatEther(balance))} canto</p>
        </div>
        <div className="dual-h-row">
          <p className="type">commission</p>
          <p className="value">
            {(
              Number(validator.validator.commission.commission_rates.rate) * 100
            ).toFixed(2)}{" "}
            %
          </p>
        </div>

        <div className="group">
          <Tabs
            disabledTabClassName="disabled"
            selectedTabClassName="selected"
            className={"tabs"}
          >
            <TabList className={"tablist"}>
              <Tab className={"tab"} selectedClassName="tab-selected">
                <Text size="text3" type="text" align="left" bold>
                  delegate
                </Text>
              </Tab>
              <Tab className={"tab"} selectedClassName="tab-selected">
                <Text size="text3" type="text" align="left" bold>
                  undelegate
                </Text>
              </Tab>
              <Tab className={"tab"} selectedClassName="tab-selected">
                <Text size="text3" type="text" align="left" bold>
                  redelegate
                </Text>
              </Tab>
            </TabList>

            <TabPanel className="tabPanel">
              <div
                className="amount"
                style={{
                  marginTop: "1rem",
                }}
              >
                <CInput
                  placeholder="enter amount..."
                  value={amount}
                  onChange={(x) => {
                    setAmount(x.target.value);
                  }}
                />
                <button
                  className="max"
                  onClick={() => {
                    //need to subtract the total fee + 1 Canto to make sure the user has enough for gas and left over canto for other transactions
                    const totalFee = BigNumber.from(delegateFee.amount)
                      .add(delegateFee.gas)
                      .add(parseEther("1"));
                    balance.sub(totalFee).lte(0)
                      ? setAmount("0")
                      : setAmount(formatEther(balance.sub(totalFee)));
                  }}
                >
                  max
                </button>
              </div>
              <div className="agreement">
                <div>
                  <CheckBox
                    checked={agreed}
                    onChange={(value) => {
                      setAgreed(value);
                    }}
                  />
                </div>
                <Text size="text3" type="text" align="left">
                  staking will lock up your funds for at least 21 days once you
                  undelegate your staked canto, you will need to wait 21 days
                  for your tokens to be liquid
                </Text>
              </div>
              <PrimaryButton
                weight="bold"
                height="big"
                disabled={
                  !agreed ||
                  Number(amount) == 0 ||
                  isNaN(Number(amount)) ||
                  Number(amount) > Number(formatEther(balance)) ||
                  !txFeeCheck.delegate
                }
                className="btn"
                onClick={() => handleDelegate()}
              >
                delegate
              </PrimaryButton>
              {!txFeeCheck.delegate && (
                <Text type="text" size="text3" style={{ color: "red" }}>
                  not enough funds for delegation fee
                </Text>
              )}
            </TabPanel>
            <TabPanel className="tabPanel">
              <div
                className="amount"
                style={{
                  marginTop: "1rem",
                }}
              >
                <CInput
                  placeholder="enter amount..."
                  value={amount}
                  onChange={(x) => {
                    setAmount(x.target.value);
                  }}
                />
                <button
                  className="max"
                  onClick={() => {
                    setAmount(
                      formatEther(
                        validator.userDelegations?.balance.amount ?? "0"
                      )
                    );
                  }}
                >
                  max
                </button>
              </div>

              <OutlinedButton
                weight="bold"
                height="big"
                className="btn"
                disabled={
                  Number(amount) == 0 ||
                  isNaN(Number(amount)) ||
                  Number(amount) >
                    Number(
                      formatEther(
                        validator.userDelegations?.balance.amount ?? "0"
                      )
                    ) ||
                  !txFeeCheck.undelegate
                }
                onClick={() => setShowUndelegateConfirmation(true)}
              >
                undelegate
              </OutlinedButton>
              {!txFeeCheck.undelegate && (
                <Text type="text" size="text3" style={{ color: "red" }}>
                  not enough funds for undelegation fee
                </Text>
              )}
              {showUndelegateConfimation && (
                <ConfirmUndelegationModal
                  onUndelegate={() => handleUndelegate()}
                  onCancel={() => setShowUndelegateConfirmation(false)}
                />
              )}
            </TabPanel>
            <TabPanel className="tabPanel">
              <div
                className="amount"
                style={{
                  marginTop: "1rem",
                }}
              >
                <div className="btn-grp">
                  <Selected>
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="choose a validator..."
                      options={allValidators.map((val) => {
                        //take out the current validator from the list
                        if (
                          val.description.moniker !=
                          validator.validator.description.moniker
                        ) {
                          return {
                            value: val,
                            label: val.description.moniker,
                          };
                        }
                        return {};
                      })}
                      onChange={(val) => {
                        setNewValidator(val?.value);
                      }}
                    />
                  </Selected>
                </div>
              </div>

              <div className="amount">
                <CInput
                  placeholder="enter amount..."
                  value={amount}
                  onChange={(x) => {
                    setAmount(x.target.value);
                  }}
                />
                <button
                  className="max"
                  onClick={() => {
                    setAmount(
                      formatEther(
                        validator.userDelegations?.balance.amount ?? "0"
                      )
                    );
                  }}
                >
                  max
                </button>
              </div>

              <PrimaryButton
                height="big"
                weight="bold"
                className="btn"
                disabled={
                  Number(amount) == 0 ||
                  isNaN(Number(amount)) ||
                  Number(amount) >
                    Number(
                      formatEther(
                        validator.userDelegations?.balance.amount ?? "0"
                      )
                    ) ||
                  newValidator == undefined ||
                  !txFeeCheck.redelegate
                }
                onClick={() => handleRedelegate()}
              >
                re-delegate
              </PrimaryButton>
              {!txFeeCheck.redelegate && (
                <Text type="text" size="text3" style={{ color: "red" }}>
                  not enough funds for re-delegation fee
                </Text>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </StakingModalContainer>
  );
};

const Selected = styled.div`
  width: 100%;
  .react-select-container {
  }
  .react-select__input-container {
    color: var(--primary-color);
  }

  .react-select__placeholder {
    filter: grayscale(1);
    padding-left: 4px;
    opacity: 0.5;
  }
  .react-select__control {
    background-color: #222222 !important;
    color: var(--primary-color) !important;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    letter-spacing: -0.03em;
    height: 56px;

    &:focus,
    &:hover {
      outline: none;
    }
  }

  .react-select__menu {
    backdrop-filter: blur(35px);
    background: #d9d9d933;
    border-radius: 4px;
    overflow: visible;
    color: var(--primary-color) !important;
  }
  .react-select__indicator-separator {
    display: none;
  }
  .react-select__value-container {
    * {
      color: var(--primary-color) !important;
    }
  }
  .react-select__menu-list {
    outline: none;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 0.6rem 0;
    align-items: center;
    color: var(--primary-color) !important;
  }

  .react-select__option {
    width: 94%;
    background-color: transparent !important;
    margin: 0.2rem 1rem;
    padding: 0.8rem 0.6rem;

    &:hover {
      border-radius: 4px;
      background-color: #ffffff1a !important;
    }
  }
`;
