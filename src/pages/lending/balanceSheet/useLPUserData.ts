import { BigNumber } from "ethers";
import { LPTokenInfo } from "./useLPInfo";
import { UserLMTokenDetails } from "../config/interfaces";

export interface UserLPTokenInfo {
  hasBalance: boolean;
  userLP: BigNumber;
  data: LPTokenInfo;
  token1Balance: BigNumber;
  token2Balance: BigNumber;
}
export function useUserLPInfo(
  userLMTokens: UserLMTokenDetails[] | undefined,
  LPTokens: LPTokenInfo[] | undefined
): UserLPTokenInfo[] | undefined {
  if (userLMTokens && LPTokens) {
    return LPTokens.map((lpToken) => {
      const lmToken = userLMTokens.find(
        (lm) => lm.data.underlying.address == lpToken.LPAddress
      );
      const lpTokenBalance =
        lmToken?.balanceOf.add(lmToken?.supplyBalance) ?? BigNumber.from(0);
      return {
        hasBalance: !lpTokenBalance?.isZero(),
        userLP: lpTokenBalance,
        data: lpToken,
        token1Balance: lpTokenBalance
          .mul(lpToken.token1.tokensPerLP)
          .div(BigNumber.from(10).pow(18)),
        token2Balance: lpTokenBalance
          .mul(lpToken.token2.tokensPerLP)
          .div(BigNumber.from(10).pow(18)),
      };
    });
  }
  return undefined;
}