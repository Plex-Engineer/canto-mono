import styled from "@emotion/styled";
import FadeIn from "react-fade-in";
import { toast } from "react-toastify";
import arrow from "../../../assets/next.svg";
import CopyIcon from "../../../assets/copy.svg";
import { truncateNumber } from "global/utils/utils";
import { PrimaryButton, Text } from "global/packages/src";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CInput } from "global/packages/src/components/atoms/Input";
import { switchNetworkButtonClassName } from "../config/transactionChecklist";

interface Props {
  connected: boolean;
  tokenSelector: React.ReactNode;
  networkName: string;
  button: React.ReactNode;
  max: string;
  amount: string;
  from: {
    name: string;
    address?: string;
    icon?: string;
  };
  to: {
    name: string;
    address?: string;
    icon?: string;
  };
  onSwitch: () => void;
  onChange: (s: string) => void;
  //if we need to send to specific address
  needAddressBox: boolean;
  onAddressChange?: (s: string) => void;
  AddressBoxPlaceholder?: string;
}

export const GeneralTransferBox = (props: Props) => {
  function copyAddress() {
    toast("copied address", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressStyle: {
        color: `
            var(--primary-color)
          `,
      },
      style: {
        border: "1px solid var(--primary-color)",
        borderRadius: "0px",
        paddingBottom: "3px",
        background: "black",
        color: `var(--primary-color)
        `,
        height: "100px",
        fontSize: "20px",
      },
      autoClose: 300,
    });
  }
  return (
    <FadeIn>
      <TransferBoxStyled disabled={!props.connected}>
        <div className="overlay">
          <PrimaryButton
            height="big"
            weight="bold"
            className={`switched ${switchNetworkButtonClassName}`}
            id="network-switch"
            onClick={props.onSwitch}
          >
            {!props.connected
              ? "switch to " + props.networkName
              : "connected to " + props.networkName}
          </PrimaryButton>
        </div>
        {props.needAddressBox && props.connected && (
          <CInput
            placeholder={props.AddressBoxPlaceholder}
            type="text"
            name="address"
            id="address"
            autoComplete="off"
            onChange={(e) => {
              if (props.onAddressChange) {
                props.onAddressChange(e.target.value);
              }
            }}
          />
        )}
        <div className="amount">
          <div className="token-selector">{props.tokenSelector}</div>

          <div className="amount-input">
            <Text type="text" size="text2" align="left" color="primary">
              amount :
            </Text>

            <input
              autoComplete="off"
              type="number"
              name="amount-bridge"
              id="amount-bridge"
              placeholder="0.00"
              value={props.amount}
              onChange={(e) => props.onChange(e.target.value)}
            />
            {Number(props.max) < 0 ? null : (
              <div className="max">
                balance {truncateNumber(props.max)}{" "}
                <span
                  tabIndex={0}
                  role="button"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => props.onChange(props.max)}
                >
                  max
                </span>
              </div>
            )}
          </div>
        </div>
        {props.connected && <div className="row">{props.button}</div>}

        <div className="address-nodes">
          {props.connected && (
            <div className="row">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {props.from.icon && (
                  <img src={props.from.icon ?? ""} height={26} />
                )}
                <Text type="text" size="text3" color="primary" align="left">
                  {props.from.name}
                </Text>
              </div>
              <img
                style={{
                  flex: "0",
                }}
                src={arrow}
                alt="right arrow"
                height={12}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img src={props.to.icon ?? ""} height={26} />
                <Text type="text" size="text3" color="primary" align="right">
                  {props.to.name}
                </Text>
              </div>
            </div>
          )}
          <hr />

          {props.connected && (
            <div className="row">
              <CopyToClipboard
                text={props.from.address ?? ""}
                onCopy={copyAddress}
              >
                <Text
                  type="text"
                  color="primary"
                  align="left"
                  size="text3"
                  style={{ cursor: "pointer" }}
                >
                  {props.from.address
                    ? props.from.address.slice(0, 5) +
                      "..." +
                      props.from.address.slice(-4)
                    : "retrieving wallet"}
                  <img
                    src={CopyIcon}
                    style={{
                      height: "22px",
                      position: "relative",
                      top: "5px",
                      left: "4px",
                    }}
                  />
                </Text>
              </CopyToClipboard>
              <img
                style={{
                  flex: "0",
                }}
                src={arrow}
                alt="right arrow"
                height={12}
              />
              <CopyToClipboard
                text={props.to.address ?? ""}
                onCopy={copyAddress}
              >
                <Text
                  type="text"
                  color="primary"
                  align="right"
                  size="text3"
                  style={{ cursor: "pointer" }}
                >
                  {props.to.address
                    ? props.to.address.slice(0, 5) +
                      "..." +
                      props.to.address.slice(-4)
                    : "retrieving wallet"}{" "}
                  <img
                    src={CopyIcon}
                    style={{
                      height: "22px",
                      marginLeft: "-6px",
                      position: "relative",
                      top: "5px",
                    }}
                  />
                </Text>
              </CopyToClipboard>
            </div>
          )}
        </div>
      </TransferBoxStyled>
    </FadeIn>
  );
};

interface StyeldProps {
  disabled?: boolean;
}
export const TransferBoxStyled = styled.div<StyeldProps>`
  background-color: black;
  border-radius: 18px;
  width: 34rem;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 26px;
  gap: 24px;
  hr {
    border: none;
    border-top: 1px solid #d9d9d92d;
  }

  .address-nodes {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 1rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
    align-items: center;
    & > * {
      flex: 1;
      flex-basis: 0;
    }
  }

  button {
    border-radius: 4px;
  }
  .overlay {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    position: absolute;
    display: ${(props) => (props.disabled ? "grid" : "none")};
    justify-content: center;
  }
  .max {
    position: absolute;
    right: 1rem;
    bottom: 5px;
    font-size: 13px;
    color: var(--primary-color);
  }
  .token {
    display: flex;
    gap: 1rem;
  }
  .switched {
    margin-top: 7.6rem;

    width: 34rem !important;
  }
  .switch {
    width: 400px;

    color: ${({ disabled }) => (disabled ? "var(--warning-color)" : "")};
    border: ${({ disabled }) =>
      disabled ? "1px solid var(--warning-color)" : ""};
    background-color: ${({ disabled }) => (disabled ? "#382e1f" : "")};
    &:hover {
      background-color: ${({ disabled }) => (disabled ? "#2a2218" : "")};
    }
  }

  .amount {
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
    opacity: ${(props) => (props.disabled ? ".4" : "1")};

    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 6rem;
    border-radius: 4px;
    background-color: #222222;

    .token-selector {
      width: 12rem;
      height: 100%;

      & > div {
        border-radius: 4px 0 0 4px;
      }
    }
    .amount-input {
      height: 100%;
      flex: 7;
      border-left: 2px solid black;
      display: flex;
      justify-content: start;
      align-items: center;
      padding: 1rem;
      gap: 1rem;

      p {
        white-space: nowrap;
      }
    }
  }

  #amount-bridge {
    outline: none;
  }

  input[type="number"] {
    background-color: transparent;
    border: none;
    border-radius: 4px;
    outline: none;
    color: var(--primary-color);
    text-align: left;
    font-size: 18px;
    padding: 6px;
    width: 100%;
    &::placeholder {
      color: var(--primary-darker-color);
    }
    &:focus,
    &:hover {
      /* background-color: #181818; */

      outline: 1px solid var(--primary-color);
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }

  @media (max-width: 1000px) {
    width: 90vw;
    max-width: 34rem;

    .overlay {
    }

    .amount {
      margin: 0rem !important;
    }

    .amount-input {
      p {
        font-size: 16px;
        width: 100%;
      }
      input {
        font-size: 16px;

        width: 100%;
      }
    }
    .token-selector {
      width: 10rem;
    }
    .switched {
      width: 90vw !important;
      max-width: 34rem;
    }
  }
`;
