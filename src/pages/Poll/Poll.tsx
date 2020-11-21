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

const poll: any = {
  timeToLive: 49743,
  hideResults: true,
  usersOnly: false,
  public: true,
  autoTags: ["Election", "Day"],
  tags: ["Election", "Day"],
  total_votes: 12,
  title: "It’s #Election #Day today!",
  description: "Who do you think is going to win?!",
  options: [
    {
      votes: 11,
      title: "Biden",
      id: "5fa172d2c43c770017d7b3c0",
      percent: Math.round((11 / 12) * 100),
    },
    {
      votes: 1,
      title: "Trump",
      id: "5fa172d2c43c770017d7b3c1",
      percent: Math.round((1 / 12) * 100),
    },
  ],
  createDate: "2020-11-03T15:10:10.246Z",
  passcode: false,
  id: "5fa172d2c43c770017d7b3bf",
};
const _prevent_fetch_: boolean = false;
const poll_loading: boolean = false;
const selected: boolean = false;
const error: string = "";

const Poll: React.FC = () => {
  const pollWrapper = useRef<HTMLDivElement>(null);
  const [popoverContent, setPopoverContent] = useState<string>("");

  const handleVote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!poll) return;

    if (poll.passcode) {
      //   setModalContent("PASSCODE");
      //   dispatch(modalOpen(pollWrapper));
      //   open(pollWrapper);
      // } else dispatch(votePoll(id, selected));
    }
  };
  const handleShare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!poll) return;

    setPopoverContent("QR");
  };


  const _QRModal = <SharePoll poll={poll} />

  let _popover_content;
  switch (popoverContent) {
	  case "PASSCODE": _popover_content = undefined; break;
	  case "QR": _popover_content = _QRModal; break;
	  default: _popover_content = undefined; break;
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
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!_prevent_fetch_ &&
        !poll_loading &&
        poll &&
        Object.keys(poll).length > 2 ? (
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

            {/* <Modal {...modalProps}>{_popover_content}</Modal> */}
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
