import React from "react";
import {
  addOutline,
  planetOutline,
  listOutline,
  logInOutline,
  logOutOutline,
  personAddOutline,
} from "ionicons/icons";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { authLogout } from "../../store/actions/authActions";

const Navbar: React.FC = () => {
  const { auth, global_loading } = useSelector((state: RootStateOrAny) => state.auth);
  const dispatch = useDispatch();
  const hasAuth = !_.isEmpty(auth);
  console.log("auth", auth);
  console.log("hasAuth", hasAuth);

  const DISPLAY_NAME = hasAuth
    ? auth.firstName
      ? auth.firstName
      : auth.email
    : (hasAuth ? "User" : "Guest");
  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hello, {DISPLAY_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle>
            <IonItem detail={false} button routerLink="/">
              <IonIcon slot="start" icon={planetOutline} />
              <IonLabel>Home</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem detail={false} button routerLink="/polls">
              <IonIcon slot="start" icon={listOutline} />
              <IonLabel>My Polls</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem detail={false} button routerLink="/poll/create">
              <IonIcon slot="start" icon={addOutline} />
              <IonLabel>Create</IonLabel>
            </IonItem>
          </IonMenuToggle>

          {hasAuth ? (
            <IonMenuToggle>
              <IonItem detail={false} button onClick={() => { dispatch(authLogout()); }}>
                <IonIcon slot="start" icon={logOutOutline} />
                <IonLabel>Log Out</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ) : (
            <>
              <IonMenuToggle>
                <IonItem detail={false} button routerLink="/login">
                  <IonIcon slot="start" icon={logInOutline} />
                  <IonLabel>Sign In</IonLabel>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle>
                <IonItem detail={false} button routerLink="/signup">
                  <IonIcon slot="start" icon={personAddOutline} />
                  <IonLabel>Sign Up</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </>
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Navbar;
