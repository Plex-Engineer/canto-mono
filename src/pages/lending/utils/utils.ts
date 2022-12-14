import { BigNumber } from "ethers";

export function formatLiquidity(liquidity: number) {
  if (liquidity < 2) {
    return liquidity.toFixed(4);
  }
  if (liquidity < 10000) {
    return liquidity.toFixed(2);
  }
  if (liquidity < 1000000) {
    return (liquidity / 1000).toFixed(1) + "k";
  }
  if (liquidity < 1000000000) return (liquidity / 1000000).toFixed(1) + "M";

  return (liquidity / 1000000000).toFixed(1) + "B";
}

//exchange rate is always scaled to 1e18
export function getSupplyBalanceFromCTokens(
  cTokenBalance: BigNumber,
  exchangeRate: BigNumber
) {
  //exchange rate is always scaled to 1e18
  return cTokenBalance.mul(exchangeRate).div(BigNumber.from(10).pow(18));
}
