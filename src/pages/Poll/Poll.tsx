import React, { useRef, useState, useEffect } from "react";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import Highlighter from "react-highlight-words";
import "./Poll.css";
import Chip from "../../components/Chip/Chip";
import PollOption from "../../components/PollOption/PollOption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faLock } from "@fortawesome/free-solid-svg-icons";
import { IonPopover } from "@ionic/react";
import SharePoll from "../../components/SharePoll/SharePoll";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { flushPoll, getPoll, votePoll } from "../../store/actions/pollActions";
import socket from "../../store/socket";
import { useParams } from "react-router";


const Poll: React.FC = () => {
  const { id } = useParams<any>();
  const pollWrapper = useRef<HTMLDivElement>(null);
  const [popoverContent, setPopoverContent] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");

  const dispatch = useDispatch();
  const { poll, error, selected, loading: poll_loading } = useSelector(
    (state: RootStateOrAny) => state.poll
  );
  const { global_loading: auth_loading, fingerprint } = useSelector(
    (state: RootStateOrAny) => state.auth
  );

  // Prevent API calls until authenticated/identified
  //   const _prevent_fetch_ = auth_loading || !fingerprint;
  const _prevent_fetch_ = auth_loading;

  const handleVote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!poll) return;

    if (poll.passcode) {
      setPopoverContent("PASSCODE");
    } else dispatch(votePoll(id, selected));
  };
  const handleShare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!poll) return;

    setPopoverContent("QR");
  };

  const handlePasscode = (e: any) => {
    e.preventDefault();
    if (!poll) return;

    dispatch(votePoll(id, selected, passcode));
    setPopoverContent("");
    setPasscode("");
  };

  // TODO : useEffect for error to display error toasts
  // Fetch poll ONLY after
  // identifying user/guest
  useEffect(() => {
    if (!_prevent_fetch_) {
      dispatch(getPoll(id));
      return () => {
        socket.emit("leave", `${id}`);
        dispatch(flushPoll());
      };
    }
  }, [id, _prevent_fetch_, dispatch]);

  const _passcodePopover = (
    <div className="form-form-wrapper">
      <h1 className="form-title">Enter Passcode</h1>
      <form onSubmit={handlePasscode} noValidate className="form-form">
        <div className="form-item">
          <div className="form-item-wrapper">
            <input
              value={passcode ?? ""}
              className="form-item__input"
              type="password"
              placeholder="e.g. ********"
              name="passcode"
              formNoValidate
              onChange={(e: any) => setPasscode(e.target.value)}
            />
            <span className="form-item__input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
        </div>
        <div className="form-item">
          <input
            disabled={!passcode || !passcode.trim()}
            onClick={handlePasscode}
            className="btn btn--tertiary form-item__submit"
            type="button"
            value="Vote"
          />
        </div>
      </form>
    </div>
  );

  const _QRPopover = <SharePoll poll={poll} />;

  let _popover_content;
  switch (popoverContent) {
    case "PASSCODE":
      _popover_content = _passcodePopover;
      break;
    case "QR":
      _popover_content = _QRPopover;
      break;
    default:
      _popover_content = undefined;
      break;
  }

  return (
    <>
      <IonPopover
        isOpen={!!popoverContent}
        cssClass="my-custom-class"
        onDidDismiss={(e) => setPopoverContent("")}
      >
        {_popover_content}
      </IonPopover>
      <div
        style={{
          display: "flex",
          minHeight: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* {!_prevent_fetch_ &&
        !poll_loading &&
        poll &&
        Object.keys(poll).length > 2 ? ( */}
        {poll && Object.keys(poll).length > 2 ? (
          <div className="form-form-wrapper poll-wrapper" ref={pollWrapper}>
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
                  {poll.tags.map((tag: string, i: number) =>
                    tag ? <Chip key={i}>{tag}</Chip> : null
                  )}
                </ul>
                <span className="poll-total-votes">{`${
                  poll.total_votes > 0 ? poll.total_votes : "no"
                } voter${poll.total_votes != 1 ? "s" : ""}`}</span>
              </div>
              <div className="poll-actions">
                {poll.passcode ? (
                  <div className="poll-action poll-action--passcode poll-action--no-active-style">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                ) : undefined}
                <div
                  className="poll-action poll-action--share"
                  onClick={handleShare}
                >
                  <FontAwesomeIcon icon={faLink} />
                </div>
                {/* <div className="poll-action poll-action--share" onClick={() => { }}>
								<i className="fas fa-share-alt"></i>
							</div> */}
                {/* <div className="poll-action poll-action--edit" onClick={() => { }}>
									<i className="fas fa-pencil-alt"></i>
								</div>
								<div className="poll-action poll-action--delete" onClick={() => { }}>
									<i className="fas fa-trash-alt"></i>
								</div>
								<div className="poll-action poll-action--minimize" onClick={() => setMinimized(!minimized)}>
									{minimized ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-up"></i>}
								</div> */}
              </div>
            </div>
            <div className="poll-body">
              <div className="form--mb1"></div>
              <div className="form--mb1"></div>

              {poll.options.map((option: any) => (
                <div className="form-item" key={option.id}>
                  <PollOption key={option.id} option={option}></PollOption>
                </div>
              ))}
              {/* {options.map(option => <PollOption id={option.id} title={option.title} description={option.description} votes={option.votes} percent={option.percent} voted={option.voted}></PollOption>)} */}
              {/* <PollOption title={options[0].title} description={options[0].description} percent={options[0].percent}></PollOption>
				<PollOption title={options[1].title} description={options[1].description} percent={options[1].percent}></PollOption>
				<PollOption title={options[2].title} description={options[2].description} percent={options[2].percent}></PollOption> */}
              {!!error ? (
                <div className="form-item form-item__error">{error}</div>
              ) : null}
              <div className="form-item">
                <button
                  className="btn btn--tertiary form-item__submit"
                  onClick={handleVote}
                  disabled={
                    selected == null || poll.voted != null || poll.expired
                  }
                >
                  Vote
                </button>
              </div>
            </div>
          </div>
        ) : // : error ? <h1>{error}</h1> : <div style={{ height: "100%", width: "100%" }}></div>
        !!error ? (
          <h1>{error}</h1>
        ) : undefined}
      </div>
    </>
  );
};

export default Poll;
