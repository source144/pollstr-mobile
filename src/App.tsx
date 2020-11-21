import React from "react";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenu,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupConfig,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { addOutline, listOutline, scanOutline } from "ionicons/icons";
import axios from "axios";
import store from "./store/store";

import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup";
import Manage from "./pages/Manage/Manage";
import CreatePoll from "./pages/CreatePoll/CreatePoll.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Poll from "./pages/Poll/Poll";
import OpenPoll from "./pages/OpenPoll/OpenPoll";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/theme.css";
import Navbar from "./components/Navbar/Navbar";
import PageToolbar from "./components/PageToolbar/Pagetoolbar";

setupConfig({ mode: "ios" });

// ~~ Axios:
axios.defaults.baseURL = "https://pollstr-app.herokuapp.com/api/";
// axios.defaults.baseURL = 'https://pollstr.app/api/';  // <- alias
// axios.defaults.baseURL = "http://localhost:5000/api/";

const App: React.FC = () => (
  <Provider store={store}>
    <IonApp>
      <IonReactRouter>
        <Navbar />
        <IonTabs>
          <IonRouterOutlet id="main">
            <PageToolbar>
              <Switch>
                <Route path="/login" exact>
                  <Login />
                </Route>
                <Route path="/signup" exact>
                  <Signup />
                </Route>
                <Route path="/password/forgot" exact>
                  <ForgotPassword />
                </Route>
                <Route path="/poll/create" exact>
                  {/* <ForgotPassword /> */}
                  <CreatePoll />
                </Route>
                <Route path="/poll/open" exact>
                  <OpenPoll />
                </Route>
                <Route path="/polls" exact>
                  <Manage />
                </Route>
                <Route path="/poll/:id">
                  <Poll />
                </Route>
                <Redirect to="/polls/" />
              </Switch>
            </PageToolbar>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="manage" href="/polls">
              <IonIcon icon={listOutline} />
              <IonLabel>Manage</IonLabel>
            </IonTabButton>
            <IonTabButton tab="open" href="/poll/open">
              <IonIcon icon={scanOutline} />
              <IonLabel>Open</IonLabel>
            </IonTabButton>
            <IonTabButton tab="create" href="/poll/create">
              <IonIcon icon={addOutline} />
              <IonLabel>Create</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </Provider>
);

export default App;
