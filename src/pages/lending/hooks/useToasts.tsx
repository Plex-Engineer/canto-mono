import { useEffect } from "react";
import { Notification } from "@usedapp/core";
import { toast } from "react-toastify";
import { transactionStatusActions } from "global/utils/utils";
import { CantoTransactionType } from "global/config/transactionTypes";

export const useToast = (
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>,
  notifications: Notification[],
  notifs: Notification[],
  setNotifs: React.Dispatch<React.SetStateAction<Notification[]>>
) => {
  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 1000);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    notifications.forEach((item) => {
      if (
        item.type == "transactionStarted" &&
        !notifs.find((it) => it.id == item.id)
      ) {
        setNotifs([...notifs, item]);
      }
      if (
        item.type == "transactionSucceed" ||
        item.type == "transactionFailed"
      ) {
        setNotifs(
          notifs.filter(
            //@ts-ignore
            (localItem) => localItem.transaction.hash != item.transaction.hash
          )
        );
      }
    });

    notifications.map((noti) => {
      if (
        //@ts-ignore
        (noti?.transactionName?.includes("type") &&
          noti.type == "transactionSucceed") ||
        noti.type == "transactionFailed"
      ) {
        const isSuccesful = noti.type != "transactionFailed";
        //@ts-ignore
        const msg: Details = JSON.parse(noti?.transactionName);
        const msgName =
          Number(msg.amount) > 0
            ? `${Number(msg.amount).toFixed(2)} ${msg.name}`
            : msg.name;
        const toastMsg = transactionStatusActions(
          Number(msg.type),
          msgName
        ).postAction;
        const msged = `${isSuccesful ? "" : "un"}successfully ${toastMsg}`;

        toast(msged, {
          position: "top-right",
          autoClose: 5000,
          toastId: noti.submittedAt,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progressStyle: {
            color: `${
              isSuccesful ? "var(--primary-color)" : "var(--error-color"
            }`,
          },
          style: {
            border: "1px solid var(--primary-color)",
            borderRadius: "0px",
            paddingBottom: "3px",
            background: "black",
            color: `${
              isSuccesful ? "var(--primary-color)" : "var(--error-color"
            }`,
            height: "100px",
            fontSize: "20px",
          },
        });
      }
    });
  }, [notifications, notifs]);
};
