import { IonLoading } from "@ionic/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authRefresh, authFingerprint } from "./store/actions/authActions";
import { ensureConnection } from "./store/socket";

export default ({ children }) => {
  const dispatch = useDispatch();

  const {
    loading: auth_loading,
    global_loading,
    fingerprint,
    global_error,
  } = useSelector((state) => state.auth);
  const { loading: poll_loading } = useSelector((state) => state.poll);
  const { loading: polls_loading } = useSelector((state) => state.polls);

  // Reduce loading state to a single boolean
  const _loading =
    !!auth_loading ||
    !!poll_loading ||
    !!polls_loading ||
    !!global_loading ||
    !fingerprint;

  // On first load only
  useEffect(() => {
    const refresh = localStorage.getItem("refresh");

    // TODO : might need to perferom auth
    // TODO : ONLY AFTER getting fingerprint
    // Get fingerprint
    if (!fingerprint) dispatch(authFingerprint());

    // Refresh auth token
    if (refresh) dispatch(authRefresh(refresh));

    const rListener = document.addEventListener("resume", ensureConnection);
    return document.removeEventListener("resume", rListener);
  }, []);

  return (
    <>
      <IonLoading isOpen={_loading} message={"Please wait..."} />
      {children}
    </>
  );
};
