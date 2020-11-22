import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { toast } from "react-toastify";
import { cordova } from "@ionic-native/core";

const MONGO_ID_REG = /^[a-fA-F0-9]{24}$/;

const OpenPoll: React.FC = () => {
  const history = useHistory();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    QRScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          QRScanner.show();

          // camera permission was granted
          let qrScanner = QRScanner.scan().subscribe((text: string) => {
            let id: string;
            const split = text.split("https://www.pollstr.app");

            if (split.length > 1 && split[1]) {
              toast("Opening Poll..", { autoClose: 1000 });
              setTimeout(() => {
                setRedirect(split[1]);
              }, 500);
            } else {
              toast.error("Invalid QR Code");
              //   history.goBack();
            }

            qrScanner.unsubscribe();
            QRScanner.hide();
            QRScanner.destroy();
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
        console.log("QR Error Occured", reason);
        toast.error("QR Error Occrured");
        history.goBack();
      });
  });

  if (!!redirect) return <Redirect to={redirect} />;

  return (
    <>
      <h2>Scan QR Code</h2>
    </>
  );
};

export default OpenPoll;
