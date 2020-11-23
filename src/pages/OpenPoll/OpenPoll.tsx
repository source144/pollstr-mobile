import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { toast } from "react-toastify";

const MONGO_ID_REG = /^[a-fA-F0-9]{24}$/;
let qrScanner: any;

const preview = (show: boolean): void => {
  if (show) {
    (window.document.querySelector("ion-app") as HTMLElement).classList.add(
      "cameraView"
    );
    window.document.body.style.backgroundColor = "transparent";
  } else {
    (window.document.querySelector("ion-app") as HTMLElement).classList.remove(
      "cameraView"
    );
    window.document.body.style.backgroundColor = "#FFF";
  }
};

const OpenPoll: React.FC = () => {
  const history = useHistory();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    QRScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          preview(true);

          // camera permission was granted
          QRScanner.show();

          if (qrScanner) {
            qrScanner.unsubscribe();
            qrScanner = undefined;
          }
          // start scanning
          qrScanner = QRScanner.scan().subscribe((text: string) => {
            preview(false);

            let id: string;
            const split = text.split("https://www.pollstr.app");

            if (split.length > 1 && split[1]) {
              toast("Opening Poll..", { autoClose: 1000 });
              setTimeout(() => {
                qrScanner.hide();
                setRedirect(split[1]);
              }, 5000);
            } else {
              toast.error("Invalid QR Code");
              qrScanner.hide();
              history.goBack();
            }
          });
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          // TODO : Display toast
          toast.error("Camera Permission Needed");
          QRScanner.openSettings();
          history.goBack();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          toast.error("Camera Permission Denied");
          history.goBack();
          // TODO : Display toast
        }
      })
      .catch((reason: any) => {
        // TODO : Display toast
        qrScanner.hide();
        console.log("QR Error Occured", reason);
        toast.error("QR Error Occrured");
        history.goBack();
      });
  }, []);

  if (!!redirect) return <Redirect to={redirect} />;

  return <></>;
};

export default OpenPoll;
