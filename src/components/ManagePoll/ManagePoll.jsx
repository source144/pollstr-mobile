import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faLink,
  faLock,
  faPencilAlt,
  faTrashAlt,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
// import { useModal, Modal } from "react-morphing-modal";
// TODO : Create my own react-hashtag component
import AnimateHeight from "react-animate-height";
// import { useSelector, useDispatch } from "react-redux";
// import LoadingOverlay from "react-loading-overlay";
// import { PushSpinner } from "react-spinners-kit";

// import SharePoll from "../../../SharePoll/SharePoll";

// import {
//   deletePoll,
//   editPoll,
//   editPollPasscode,
//   flushOpErrors,
// } from "../../../../store/actions/managePollsActions";
// import {
//   modalClose,
//   modalOpen,
//   modalStatFade,
// } from "../../../../store/actions/modalActions";
// import EditPoll from "../../../EditPoll/EditPoll";
// import { disableVoting } from "../../../../store/actions/pollActions";
import Highlighter from "react-highlight-words";
import Chip from "../Chip/Chip";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import PollOption from "../PollOption/PollOption";
import SharePoll from "../SharePoll/SharePoll";
import { IonPopover } from "@ionic/react";
import EditPollPopover from "../EditPollPopover/EditPollPopover";

const error = undefined;
const selected = undefined;
const form_loading = "";

const form_error = "";

const ManagePoll = ({ poll }) => {
  const [submited, setSubmited] = useState(undefined);
  const [minimized, setMinimized] = useState(false);
  const [passcode, setPasscode] = useState(undefined);
  const [popoverContent, setPopoverContent] = useState("");
  const pollWrapper = useRef();

  //   const dispatch = useDispatch();
  //   const { isOpen: modal_open } = useSelector((state) => state.modal);
  //   const { op_loading: form_loading, op_error: form_error } = useSelector(
  // (state) => state.polls
  //   );
  //   const { modalProps, open, close } = useModal({
  //     id: `poll-${poll.id}-modal`,
  //     onClose: () => {
  //       dispatch(modalClose(pollWrapper));
  //       dispatch(flushOpErrors());
  //       setSubmited(false);
  //     },
  //     background: "rgb(0, 0, 0, 0.6)",
  //   });

  //   const handleHashTagClick = (tag) =>
  //     console.log("TODO: redirect to search", tag);

  const handleOpenPopover = (e, popoverFor) => {
    if (e) e.preventDefault();

    setPopoverContent(popoverFor);
    // setpopoverContent(popoverFor);
    // dispatch(modalOpen(pollWrapper));
    // open(pollWrapper);
  };

  const handleDeletePoll = (e) => {
    e.preventDefault();

    // dispatch(deletePoll(poll.id));
    // setSubmited(true);
  };
  const handleSavePasscode = (e) => {
    e.preventDefault();

    // dispatch(editPollPasscode(poll.id, passcode));
    // setSubmited(true);
  };
  const handleSavePoll = (pollData) => {
    // dispatch(editPoll(poll.id, pollData));
    // setSubmited(true);
  };

  const _deleteModal = (
    <div className="form-form-wrapper">
      {/* <LoadingOverlay
        active={form_loading}
        classNamePrefix="modal-loader-"
        spinner={<PushSpinner color={"#55c57a"} />}
      > */}
      <h1 className="form-title">Delete Poll</h1>
      <form onSubmit={handleDeletePoll} formNoValidate className="form-form">
        <div className="form-item" style={{ fontSize: "14px" }}>
          Are you sure you want to delete this poll?
        </div>
        <div className="form-item">
          {!!form_error ? (
            <div className="form-item__error">{form_error}</div>
          ) : null}
          <input
            // TODO : Disabled when deleting..
            // onClick={handleDelete}
            onClick={handleDeletePoll}
            className="btn btn--danger form-item__submit"
            style={{ marginTop: 0 }}
            type="button"
            value="DELETE"
          />
        </div>
      </form>
      {/* </LoadingOverlay> */}
    </div>
  );

  const _editPasscodeModal = (
    <div className="form-form-wrapper">
      {/* <LoadingOverlay
        active={form_loading}
        classNamePrefix="modal-loader-"
        spinner={<PushSpinner color={"#55c57a"} />}
      > */}
      <h1 className="form-title">
        {poll.passcode ? "Modify Passcode" : "Add Passcode"}
      </h1>
      <form onSubmit={handleSavePasscode} noValidate className="form-form">
        <div className="form-item">
          <div className="form-item-wrapper">
            <input
              value={passcode ?? ""}
              className="form-item__input"
              type="password"
              // placeholder="Remove Passcode"
              placeholder={
                poll.passcode ? "(Remove passcode)" : "(No passcode)"
              }
              name="passcode"
              formNoValidate
              onChange={(e) => setPasscode(e.target.value)}
            />
            <span className="form-item__input-icon">
              <FontAwesomeIcon icon={!passcode ? faUnlock : faLock} />
            </span>
            {poll.passcode ? (
              <label htmlFor="passcode" style={{ flexDirection: "column" }}>
                <span
                  style={{
                    alignSelf: "flex-end",
                    fontStyle: "italic",
                    fontSize: "10px",
                  }}
                >
                  (leave empty to remove passcode)
                </span>
              </label>
            ) : undefined}
          </div>
        </div>
        <div className="form-item">
          {!!form_error ? (
            <div className="form-item__error">{form_error}</div>
          ) : null}
          <input
            onClick={handleSavePasscode}
            className="btn btn--tertiary form-item__submit"
            type="button"
            value="Save"
          />
        </div>
      </form>
      {/* </LoadingOverlay> */}
    </div>
  );

  let _popover_content;
  switch (popoverContent) {
    case "PASSCODE":
      _popover_content = _editPasscodeModal;
      break;
    case "DELETE":
      _popover_content = _deleteModal;
      break;
    case "EDIT":
      _popover_content = (
        <EditPollPopover
          poll={poll}
          loading={form_loading}
          error={form_error}
          onSubmit={handleSavePoll}
        />
      );
      break;
    case "QR":
      console.log("QR Popover");
      _popover_content = <SharePoll poll={poll} />;
      break;
    default:
      _popover_content = undefined;
      break;
  }

  return (
    <>
      {/* TODO : Minimize & and & Expand Buttons on top right */}
      {/* TODO : -------------------------------------------- */}
      {/* TODO : for minimize can use max-height: 100% */}
      {/* TODO : on state change, add a class with max-height: 0% */}
      {/* TODO : example at https://stackoverflow.com/a/49517490/9382757 */}
      {/* TODO : Or... BETTER: */}
      {/* TODO : https://www.npmjs.com/package/react-animate-height*/}
      {/* TODO : ------------------------------------------------------- */}
      {/* TODO : Remove "vote" button */}
      {/* TODO : Add "Edit" and "Delete" buttons?? */}
      <IonPopover
        isOpen={!!popoverContent}
        cssClass="my-custom-class"
        onDidDismiss={(e) => setPopoverContent("")}
      >
        {_popover_content}
      </IonPopover>
      {poll && Object.keys(poll).length > 2 ? (
        <div
          className="form-form-wrapper poll-wrapper"
          style={{ margin: "30px" }}
          ref={pollWrapper}
        >
          <div
            className="poll-detail-wrapper"
            style={poll.timeToLive ? { padding: "1.4rem" } : {}}
          >
            {!poll.timeToLive ? undefined : (
              <CountdownTimer
                onComplete={() => {
                  // dispatch(disableVoting());
                }}
                startDate={poll.createDate}
                timeToLive={poll.timeToLive}
              />
            )}
            <div className="poll-info">
              <h1
                className="poll-title"
                style={!poll.timeToLive ? { fontSize: "1.6rem" } : {}}
              >
                <Highlighter
                  // onHashtagClick={handleHashTagClick}
                  highlightClassName="poll-title-tag"
                  activeClassName="poll-title-tag"
                  textToHighlight={poll.title}
                  autoEscape={true}
                  searchWords={["/#w+/g"]}
                  // searchWords={['/^#(?!_)\w+/']}
                  // searchWords={['/\B(#(?!_)\w+\b)(?!#)/']}
                  // searchWords={/\B(#(?!_)\w+\b)(?!#)/g}
                />
              </h1>
              <div
                className="form-description"
                style={!poll.timeToLive ? { fontSize: "1.2rem" } : {}}
              >
                <p className="poll-description">{poll.description}</p>
              </div>
              <ul className="poll-tags">
                {poll.tags.map((tag, i) =>
                  tag ? <Chip key={i}>{tag}</Chip> : null
                )}
              </ul>
              <span className="poll-total-votes">{`${
                poll.total_votes > 0 ? poll.total_votes : "no"
              } voter${poll.total_votes != 1 ? "s" : ""}`}</span>
            </div>
            <div className="poll-actions">
              <div
                className="poll-action poll-action--share"
                onClick={(e) => handleOpenPopover(e, "QR")}
              >
                <FontAwesomeIcon icon={faLink} />
              </div>
              {/* <div className="poll-action poll-action--share" onClick={() => { }}>
								<i className="fas fa-share-alt"></i>
							</div> */}
              <div
                className="poll-action poll-action--edit"
                onClick={(e) => handleOpenPopover(e, "EDIT")}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </div>
              <div
                className="poll-action poll-action--passcode"
                onClick={(e) => handleOpenPopover(e, "PASSCODE")}
              >
                {poll.passcode ? (
                  <FontAwesomeIcon icon={faLock} />
                ) : (
                  <FontAwesomeIcon icon={faUnlock} />
                )}
              </div>
              <div
                className="poll-action poll-action--delete"
                onClick={(e) => handleOpenPopover(e, "DELETE")}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </div>
              <div
                className="poll-action poll-action--minimize"
                onClick={() => setMinimized(!minimized)}
              >
                {minimized ? (
                  <FontAwesomeIcon icon={faChevronDown} />
                ) : (
                  <FontAwesomeIcon icon={faChevronUp} />
                )}
              </div>
            </div>
          </div>
          <AnimateHeight
            duration={500}
            height={minimized ? 0 : "auto"}
            className="poll-body"
          >
            {/* TODO : Poll options without selection, etc. */}
            {poll.options.map((option) => (
              <div className="form-item" key={option.id}>
                <PollOption option={option} interactable={false}></PollOption>
              </div>
            ))}
            {error ? (
              <div className="form-item form-item__error">{error}</div>
            ) : null}

            <div style={{ marginTop: "20px" }}></div>
            {/* TODO : Edit/Delete Buttons ?? */}
          </AnimateHeight>

          {/* TODO : Edit / or / Stats Modal */}
          {/* TODO : use the Create Poll Form, with disabled fields */}

          {/* <Modal {...modalProps}>{_popover_content}</Modal> */}

          {/* TODO : modal for "are you sure you want to delete"? */}
        </div>
      ) : // TODO : no need for placeholder component here
      // TODO : Display error nicer ??
      // TODO : on loading have loading modal on top of component
      error ? (
        <h1>{error}</h1>
      ) : (
        <h3>PLACE-HOLDER</h3>
      )}
    </>
  );
};

export default ManagePoll;
