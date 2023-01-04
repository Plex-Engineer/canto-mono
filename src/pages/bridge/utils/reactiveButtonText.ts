import { TransactionState } from "@usedapp/core";
import { BigNumber } from "ethers";
import { CantoTransactionType } from "global/config/transactionTypes";
import {
  getTransactionStatusString,
  transactionStatusActions,
} from "global/utils/utils";
import {
  BaseToken,
  EmptySelectedConvertToken,
  EmptySelectedNativeToken,
  UserGravityBridgeTokens,
  UserNativeTokens,
} from "../config/interfaces";

const increaseAllowanceActions = transactionStatusActions(
  CantoTransactionType.INCREASE_ALLOWANCE
);
const enableActions = transactionStatusActions(CantoTransactionType.ENABLE);
const sendTokenActions = transactionStatusActions(
  CantoTransactionType.SEND_TOKEN
);

const SELECT_A_TOKEN = "select a token";
const INSUFFICIENT_BALANCE = "insufficient balance";
const ENTER_AMOUNT = "enter amount";
//returns button text and if it is disabled
export function getReactiveButtonText(
  hasPubKey: boolean,
  amount: BigNumber,
  token: UserGravityBridgeTokens,
  approveStatus: TransactionState,
  cosmosStatus: TransactionState
): [string, boolean] {
  // if (!hasPubKey) {
  //   return ["please create public key", true];
  // }
  if (token.allowance.eq(-1)) {
    return [SELECT_A_TOKEN, true];
  } else if (amount.gt(token.balanceOf) && !token.allowance.isZero()) {
    return [INSUFFICIENT_BALANCE, true];
  } else if (amount.isZero() && !token.allowance.isZero()) {
    return [ENTER_AMOUNT, true];
  } else if (amount.gt(token.allowance) && !token.allowance.isZero()) {
    return [
      getTransactionStatusString(
        increaseAllowanceActions.action,
        increaseAllowanceActions.inAction,
        increaseAllowanceActions.postAction,
        approveStatus
      ),
      false,
    ];
  } else if (token.allowance.isZero()) {
    return [
      getTransactionStatusString(
        enableActions.action,
        enableActions.inAction,
        enableActions.postAction,
        approveStatus
      ),
      false,
    ];
  } else {
    return [
      getTransactionStatusString(
        sendTokenActions.action,
        sendTokenActions.inAction,
        sendTokenActions.postAction,
        cosmosStatus
      ),
      false,
    ];
  }
}

export function getConvertButtonText(
  amount: BigNumber,
  token: BaseToken,
  maxAmount: BigNumber,
  cantoToEVM: boolean
): [string, boolean] {
  if (token == EmptySelectedNativeToken || token == EmptySelectedConvertToken) {
    return [SELECT_A_TOKEN, true];
  } else if (amount.isZero()) {
    return [ENTER_AMOUNT, true];
  } else if (amount.gt(maxAmount)) {
    return [INSUFFICIENT_BALANCE, true];
  } else {
    return [cantoToEVM ? "bridge in" : "bridge out", false];
  }
}

export function getBridgeOutButtonText(
  amount: BigNumber,
  token: UserNativeTokens,
  maxAmount: BigNumber,
  cosmosAddress: boolean
): [string, boolean] {
  const [text, disabled] = getConvertButtonText(
    amount,
    token,
    maxAmount,
    false
  );
  if (disabled) {
    return [text, disabled];
  } else if (!cosmosAddress) {
    return ["invalid address", true];
  } else {
    return ["bridge out", false];
  }
}
