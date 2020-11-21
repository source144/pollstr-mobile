import React from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolleyballBall,
} from "@fortawesome/free-solid-svg-icons";

const PageToolbar: React.FC = ({ children }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonMenuButton slot="start" />
          </IonButtons>
          <IonTitle id="header-logo-text">
            Pollstr <FontAwesomeIcon id="header-logo-icon" icon={faVolleyballBall} />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default PageToolbar;
