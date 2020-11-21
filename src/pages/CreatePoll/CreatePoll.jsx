import React, { useState } from "react";
import {
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonReorder,
  IonReorderGroup,
  IonItem,
} from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPlusCircle,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import Switch from "react-ios-switch";
import axios from "axios";
import moment from "moment";
import QRCode from "qrcode.react";
import HashtagTextArea from "../../components/HashtagTextArea/HashtagTextArea";
import { v4 as uuid } from "uuid";
import _ from "lodash";

import "./CreatePoll.css";
import CreatePollOption from "../../components/CreatePollOption/CreatePollOption";

const responseError = "";
const errors = {};
const tempDate = Date.now();
const currentYear = new Date().getFullYear();
const isLoggedIn = false;
const title = "";

const CreatePoll = () => {
  const [resultsHidden, setResultsHidden] = useState(true);
  const [publicPoll, setPublicPoll] = useState(false);
  const [allowGuests, setAllowGuests] = useState(true);
  const [options, setOptions] = useState([
    { id: uuid(), value: "1" },
    { id: uuid(), value: "2" },
    { id: uuid(), value: "3" },
  ]);

  function doReorder(e) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log("Dragged from index", e.detail.from, "to", e.detail.to);

    if (e.detail.from != e.detail.to) {
      const _options = [...options];
      _options.splice(e.detail.from, 1);
      _options.splice(e.detail.to, 0, options[e.detail.from]);

      setOptions([..._options]);
    }

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    e.detail.complete();
  }

  console.log(IonDatetime);

  const checkForDuplicates = (_options_, mutable = true) => {
    // Use a "clone" if options is immutable
    if (!mutable) _options_ = [..._options_];

    // Find duplicate options' indecies
    const duplicates = {};
    _.forEach(_options_, (option, idx) => {
      // If can't operate on option or option can't be a duplicate
      if (typeof option.value !== "string" || !option.value) return;

      // For ease of use
      const trimmedVal = option.value.trim();

      // Add index of existing duplicate
      if (duplicates.hasOwnProperty(trimmedVal))
        duplicates[trimmedVal].push(idx);
      // Add index of new duplicate
      else if (
        idx !=
        _.findLastIndex(
          _options_,
          (_o) => typeof _o.value === "string" && _o.value.trim() === trimmedVal
        )
      )
        duplicates[trimmedVal] = [idx];
    });

    // Mark all duplicate options as duplicates, using indecies found above
    _.forEach(duplicates, (duplicate) => {
      _.forEach(duplicate, (idx) => (_options_[idx].error = "duplicate"));
    });

    // Return options with marked duplicates
    return _options_;
  };

  const onOptionChange = (index, value) => {
    const _options = [...options].map((option) => ({ ...option, error: "" }));
    _options[index].value = value;

    // Update the options with new
    // values and possible dupliates
    setOptions([...checkForDuplicates(_options)]);
  };

  const onOptionDelete = (index) => {
    // Mutate options and reset all error states
    const _options = [...options].map((option) => ({ ...option, error: "" }));

    // Eject the deleted option
    _options.splice(index, 1);

    // Check for possible duplicates
    // and update the options state
    setOptions([...checkForDuplicates(_options)]);
  };

  const onOptionAdd = (e) => {
    e.preventDefault();
    setOptions([...options, { id: uuid(), value: "" }]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleTitle = (e) => {
    console.log(e);
    // e.preventDefault();
  };
  const handleDescription = (e) => {
    // e.preventDefault();
    console.log(e);
  };
  const handlePasscode = (e) => {
    // e.preventDefault();
    console.log(e);
  };
  const handleTags = (e) => {
    // e.preventDefault();
    console.log(e);
  };
  const setExpireDate = (e) => {
    // e.preventDefault();
    console.log(e);
  };

  return (
    <div className="form-form-wrapper poll-create-form">
      <h1 className="form-title">Create Poll</h1>
      <div onSubmit={handleSubmit} formNoValidate className="form-form">
        {/* General Information */}
        <div className="form-item">
          <label htmlFor="title" className="required">
            Poll Title
          </label>
          <div className="form-item-wrapper">
            <HashtagTextArea
              className={`form-item__input ${
                !!errors.title ? "form-item__input--err" : ""
              }`}
              placeholder="e.g. Apples or Bananas? #Fruit"
              tagClass="form-item__input--hashtag"
              onChange={handleTitle}
              singleline={true}
            />
          </div>
          {!!errors.title ? (
            <span className="form-item__error">{errors.title}</span>
          ) : null}
        </div>
        <div className="form-item">
          <label htmlFor="description">Description</label>
          {/* <div className='form-item-wrapper'> */}
          <HashtagTextArea
            className={`form-item__input form-item__input--textarea ${
              !!errors.description ? "form-item__input--err" : ""
            }`}
            placeholder="e.g. Let's settle this once and for all! Which #fruit is better? Apples or Bananas?"
            tagClass="form-item__input--hashtag"
            newlines={true}
            onChange={handleDescription}
          />
          {/* </div> */}
          {!!errors.description ? (
            <span className="form-item__error">{errors.description}</span>
          ) : null}
        </div>
        {/* Poll Options */}
        <div className="form-item">
          <label className="required">Options</label>
          {!!errors.options ? (
            <span className="form-item__error">{errors.options}</span>
          ) : null}
          <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
            {options.map((option, idx) => (
              //   <IonItem
              <div
                className="option-item"
                key={option.id}
                style={{ border: "none" }}
              >
                <IonReorder slot="start" class="option-reorder" />
                <CreatePollOption
                  id={option.id}
                  index={idx}
                  hasError={option.error}
                  deleteable={options.length > 2}
                  onChange={onOptionChange}
                  onDelete={onOptionDelete}
                  value={option.value}
                />
              </div>
              //   </IonItem>
            ))}
          </IonReorderGroup>
          <div className="poll__add-option">
            <button className="btn btn--primary" onClick={onOptionAdd}>
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </div>
        </div>
        {/* Expiry and Poll Settings */}
        <div className="form-item">
          <IonDatetime
            displayFormat="D MMM YYYY hh:mm a"
            min={currentYear}
            max={currentYear + 5}
            value={tempDate}
            onIonChange={(e) => {} /* setSelectedDate(e.detail.value!) */}
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
        {/* <div className="form-item form-item--no-margin form--mb1">
          <label htmlFor="expire" className="rw-datepicker-label">
            Expire Date
          </label>
          <DateTimePicker
            min={new Date()}
            onChange={(date) => setExpireDate(date)}
            step={5}
            timeCaption="time"
            placeholder="No Exipiry Set"
          />
        </div> */}
        <div className="form-item">
          <label htmlFor="passcode">Passcode</label>
          <p className="optional">Require a passcode for every vote</p>
          <div className="form-item-wrapper">
            <input
              className={`form-item__input ${
                !!errors.passcode ? "form-item__input--err" : ""
              }`}
              type="password"
              placeholder="e.g. *******"
              name="passcode"
              formNoValidate
              onChange={handlePasscode}
            />
          </div>
          {!!errors.passcode ? (
            <span className="form-item__error">{errors.passcode}</span>
          ) : null}
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
              onChange={handleTags}
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
        {!!responseError ? (
          <div className="form-item__error">{responseError}</div>
        ) : null}
        <div
          className="form-item"
          //   style={!isMobile ? { marginRight: "-1rem" } : {}}
        >
          <input
            className={`btn btn--tertiary form-item__submit ${
              !!errors.confirm ? "form-item__input--err" : ""
            }`}
            type="submit"
            value="Create!"
            onClick={handleSubmit}
            disabled={
              !title ||
              !_.filter(
                options,
                (option) => !!option.value && !!option.value.trim()
              ).length >= 2
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
