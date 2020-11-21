import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import _ from "lodash";

import Switch from "react-ios-switch";
import { IonDatetime } from "@ionic/react";
// import LoadingOverlay from 'react-loading-overlay';
// import { PushSpinner } from 'react-spinners-kit'

const responseError = "";
const errors = {};
const tempDate = Date.now();
const currentYear = new Date().getFullYear();
const isLoggedIn = false;
const title = "";

const EditPollPopover = ({
  poll,
  loading = false,
  error = undefined,
  onSubmit = undefined,
}) => {
  // const { auth, global_loading: auth_loading } = useSelector(state => state.auth);
  //   const isLoggedIn = !_.isEmpty(auth);
  const isLoggedIn = false;

  console.log("POLL", poll);

  const [submitted, setSubmitted] = useState(false);
  const [tags, setTags] = useState(
    poll.specifiedTags
      ? typeof poll.specifiedTags === "string"
        ? poll.specifiedTags
        : poll.specifiedTags.join(" ")
      : ""
  );
  const [resultsHidden, setResultsHidden] = useState(poll.hideResults);
  const [allowGuests, setAllowGuests] = useState(!poll.usersOnly);
  const [publicPoll, setPublicPoll] = useState(poll.public);
  const [expireDate, setExpireDate] = useState(
    poll.timeToLive > 0
      ? moment
          .unix(moment(poll.createDate).unix() + poll.timeToLive)
          .toDate()
          .toUTCString()
      : ""
  );

  console.log(poll.specifiedTags);

  const unchanged_tags =
    tags == poll.specifiedTags && !!poll.specifiedTags
      ? typeof poll.specifiedTags === "string"
        ? poll.specifiedTags
        : poll.specifiedTags.join(" ")
      : "";
  const unchanged_resultsHidden = resultsHidden == poll.hideResults;
  const unchanged_allowGuests = allowGuests == !poll.usersOnly;
  const unchanged_publicPoll = publicPoll == poll.public;
  const unchanged_expireDate =
    expireDate ==
    (poll.timeToLive > 0
      ? moment.unix(moment(poll.createDate).unix() + poll.timeToLive).toDate()
      : undefined);
  const disableSave =
    unchanged_tags &&
    unchanged_resultsHidden &&
    unchanged_allowGuests &&
    unchanged_publicPoll &&
    unchanged_expireDate;

  const errors = { tags: "" };
  console.log("expireDate", expireDate);

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (onSubmit && typeof onSubmit === "function") {
      setSubmitted(true);
      console.log("expireDate", expireDate);
      console.log("poll.createDate", poll.createDate);
      const _timeToLive = !!expireDate
        ? moment(expireDate).unix() - moment(poll.createDate).unix()
        : 0;
      onSubmit({
        tags: tags,
        hideResults: resultsHidden,
        usersOnly: !allowGuests,
        public: publicPoll,
        timeToLive: _timeToLive,
      });
    }
  };

  useEffect(() => {
    if (submitted && !loading && !error) {
      setTags(poll.specifiedTags);
      setResultsHidden(poll.hideResults);
      setAllowGuests(!poll.usersOnly);
      setPublicPoll(poll.public);
      setExpireDate(
        poll.timeToLive > 0
          ? moment
              .unix(moment(poll.createDate).unix() + poll.timeToLive)
              .toDate()
          : undefined
      );
    }
  }, [submitted]);

  return (
    <>
      <div className="form-form-wrapper poll-create-form">
        {/* <LoadingOverlay
				active={loading}
				classNamePrefix='modal-loader-'
				spinner={<PushSpinner color={'#55c57a'} />}> */}
        <h1 className="form-title">Edit Poll</h1>
        <div onSubmit={handleSubmit} formNoValidate className="form-form">
          {/* Expiry and Poll Settings */}
          <div className="form-item">
            <IonDatetime
              displayFormat="D MMM YYYY hh:mm a"
              min={currentYear}
              max={currentYear + 5}
              value={expireDate}
              onIonChange={(e) => {
                setExpireDate(e.detail.value);
              }}
              // pickerOptions={{
              //   ...IonDatetime.defaultProps.pickerOptions,
              //   buttons: [
              //     {
              //       text: "Clear",
              //       handler: () => console.log("Clicked Clear!"),
              //     },
              //     ...IonDatetime.defaultProps.pickerOptions.buttons,
              //   ],
              // }}
              // onBlur={} TODO : clear value if invalid
              placeholder="No Expiry Set"
              className={`form-item__input ${
                !!errors.passcode ? "form-item__input--err" : ""
              }`}
            ></IonDatetime>
          </div>

          <div className="form-item">
            <label htmlFor="tags">Tags</label>
            <div className="form-item-wrapper">
              <input
                className={`form-item__input ${
                  !!errors.tags ? "form-item__input--err" : ""
                }`}
                type="text"
                placeholder="e.g. #Food #Health"
                name="tags"
                formNoValidate
                onChange={(e) => {
                  setTags(e.target.value);
                }}
              />
              <span className="form-item__input-icon">
                <FontAwesomeIcon icon={faTags} />
              </span>
            </div>
            {!!errors.tags ? (
              <span className="form-item__error">{errors.tags}</span>
            ) : null}
          </div>
          <div className="form-item form-item--row">
            <label
              className="form-item__multiline-label"
              htmlFor="resultsHidden"
              onClick={() => setResultsHidden(!resultsHidden)}
            >
              <span className="form-item__multiline-label-title">
                Hidden Results
              </span>
              <span className="form-item__multiline-label-description">
                Visible only after voting?
              </span>
            </label>
            <Switch
              checked={resultsHidden}
              onChange={() => setResultsHidden(!resultsHidden)}
              name="resultsHidden"
            />
          </div>
          <div className="form-item form-item--row">
            <label
              className="form-item__multiline-label"
              htmlFor="allowGuests"
              onClick={() =>
                !isLoggedIn ? setResultsHidden(!allowGuests) : undefined
              }
            >
              <span className="form-item__multiline-label-title">
                Guest Votes
              </span>
              <span className="form-item__multiline-label-description">
                Can guests vote?
              </span>
            </label>
            <Switch
              checked={allowGuests}
              onChange={() => setAllowGuests(!allowGuests)}
              name="allowGuests"
              disabled={!isLoggedIn}
            />
          </div>
          <div className="form-item form-item--row">
            <label
              className="form-item__multiline-label"
              htmlFor="publicPoll"
              onClick={() => setPublicPoll(!publicPoll)}
            >
              <span className="form-item__multiline-label-title">
                Public Poll
              </span>
              <span className="form-item__multiline-label-description">
                Should the poll be featured?
              </span>
            </label>
            <Switch
              checked={publicPoll}
              onChange={() => setPublicPoll(!publicPoll)}
              name="publicPoll"
            />
          </div>
          {!!error ? <div className="form-item__error">{error}</div> : null}
          <div
            className="form-item"
            // style={!isMobile ? { marginRight: "-1rem" } : {}}
          >
            <input
              className={`btn btn--tertiary form-item__submit ${
                !!errors.confirm ? "form-item__input--err" : ""
              }`}
              type="submit"
              value="Save"
              onClick={handleSubmit}
              disabled={disableSave}
            />
          </div>
        </div>
        {/* </LoadingOverlay> */}
      </div>
    </>
  );
};

export default EditPollPopover;
