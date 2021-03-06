import React, { useEffect, useRef, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import ManagePoll from "../../components/ManagePoll/ManagePoll";
import _ from "lodash";
import { flushPolls, getPolls } from "../../store/actions/managePollsActions";
import { Link } from "react-router-dom";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const polls = [
//   {
//     timeToLive: 0,
//     hideResults: true,
//     usersOnly: false,
//     public: false,
//     autoTags: ["Cool"],
//     tags: [""],
//     total_votes: 2,
//     title: "This is #Cool ??",
//     description: "Choose an option",
//     options: [
//       {
//         votes: 1,
//         title: "Yes",
//         id: "5fa0660a8f362800176f8031",
//         percent: Math.round((1 / 2) * 100),
//       },
//       {
//         votes: 1,
//         title: "No",
//         id: "5fa0660a8f362800176f8032",
//         percent: Math.round((1 / 2) * 100),
//       },
//       {
//         votes: 0,
//         title: "Maybe",
//         id: "5fa0660a8f362800176f8033",
//         percent: Math.round((0 / 2) * 100),
//       },
//     ],
//     createDate: "2020-11-02T20:03:22.292Z",
//     passcode: false,
//     id: "5fa0660a8f362800176f8030",
//   },
//   {
//     timeToLive: 0,
//     hideResults: false,
//     usersOnly: false,
//     public: false,
//     autoTags: ["beach", "pool"],
//     tags: [""],
//     total_votes: 2,
//     title: "Where should we go? #beach or #pool",
//     description: "Should we go to the #beach or to the #pool?",
//     options: [
//       {
//         votes: 1,
//         title: "Beach!",
//         id: "5fa0dbf2bfea78001764122e",
//         percent: Math.round((1 / 2) * 100),
//       },
//       {
//         votes: 1,
//         title: "Pool",
//         id: "5fa0dbf2bfea78001764122f",
//         percent: Math.round((1 / 2) * 100),
//       },
//     ],
//     createDate: "2020-11-03T04:26:26.939Z",
//     passcode: false,
//     id: "5fa0dbf2bfea78001764122d",
//   },
//   {
//     timeToLive: 1469,
//     hideResults: false,
//     usersOnly: false,
//     public: false,
//     autoTags: ["beach", "pool"],
//     tags: [""],
//     total_votes: 0,
//     title: "What should we do today? #beach or #pool",
//     description: "It's a very difficult question :(",
//     options: [
//       {
//         votes: 0,
//         title: "Beach!",
//         id: "5fa0dca1bfea780017641231",
//         percent: 0,
//       },
//       {
//         votes: 0,
//         title: "Pool",
//         id: "5fa0dca1bfea780017641232",
//         percent: 0,
//       },
//     ],
//     createDate: "2020-11-03T04:29:21.796Z",
//     passcode: false,
//     id: "5fa0dca1bfea780017641230",
//   },
//   {
//     timeToLive: 0,
//     hideResults: true,
//     usersOnly: false,
//     public: false,
//     autoTags: [],
//     tags: [""],
//     total_votes: 0,
//     title: "aaa",
//     options: [
//       {
//         votes: 0,
//         title: "aasda",
//         id: "5fa12068bf9f450017c4acd6",
//         percent: 0,
//       },
//       {
//         votes: 0,
//         title: "aaaas",
//         id: "5fa12068bf9f450017c4acd7",
//         percent: 0,
//       },
//     ],
//     passcode: true,
//     createDate: "2020-11-03T09:18:32.048Z",
//     id: "5fa12068bf9f450017c4acd5",
//   },
//   {
//     timeToLive: 291,
//     hideResults: true,
//     usersOnly: false,
//     public: false,
//     autoTags: ["mobile", "test"],
//     tags: [""],
//     total_votes: 1,
//     title: "Test #mobile",
//     description: "This is a #test",
//     options: [
//       {
//         votes: 0,
//         title: "A bee",
//         id: "5fa15e04bbd85700172462c5",
//         percent: Math.round((0 / 2) * 100),
//       },
//       {
//         votes: 1,
//         title: "Cee deee",
//         id: "5fa15e04bbd85700172462c6",
//         percent: Math.round((1 / 2) * 100),
//       },
//     ],
//     passcode: true,
//     createDate: "2020-11-03T13:41:24.433Z",
//     id: "5fa15e04bbd85700172462c4",
//   },
//   {
//     timeToLive: 4970043,
//     hideResults: true,
//     usersOnly: false,
//     public: true,
//     autoTags: ["Election", "Day"],
//     tags: [""],
//     total_votes: 12,
//     title: "It’s #Election #Day today!",
//     description: "Who do you think is going to win?!",
//     options: [
//       {
//         votes: 11,
//         title: "Biden",
//         id: "5fa172d2c43c770017d7b3c0",
//         percent: Math.round((11 / 12) * 100),
//       },
//       {
//         votes: 1,
//         title: "Trump",
//         id: "5fa172d2c43c770017d7b3c1",
//         percent: Math.round((1 / 12) * 100),
//       },
//     ],
//     createDate: "2020-11-03T15:10:10.246Z",
//     passcode: false,
//     id: "5fa172d2c43c770017d7b3bf",
//   },
// ];

const _prevent_fetch_: boolean = false;
const polls_loading: boolean = false;
const poll_loading: boolean = false;
const selected: boolean = false;
const polls_error: string = "";
const form_error: string = "";

const Manage: React.FC = () => {
  const dispatch = useDispatch();
  const { polls, loading: polls_loading, error: polls_error } = useSelector(
    (state: RootStateOrAny) => state.polls
  );
  const { auth, global_loading: auth_loading, fingerprint } = useSelector(
    (state: RootStateOrAny) => state.auth
  );
  const [disableSearch, setDisableSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const searchForm = useRef(null);
  const hasAuth = !_.isEmpty(auth);

  // Prevent API calls until authenticated/identified
  const _prevent_fetch_ = auth_loading || (!fingerprint && !hasAuth);

  let noResults;
  if (!_prevent_fetch_ && !polls_loading) {
    if (searchQuery)
      noResults = (
        <>
          <div className="noresult--primary">No Polls Found</div>
          <div className="noresult--secondary">Try a different filter</div>
        </>
      );
    else
      noResults = (
        <>
          <div className="noresult--primary">You have no Polls</div>
          <Link to="/poll/create" className="btn btn--primary-1 noresult--cta">
            Create New Poll
          </Link>
        </>
      );
  }

  const clearSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!currentQuery) return;

    const input: any = searchForm!.current!["query"];
    input.value = "";

    setCurrentQuery("");
    setDisableSearch("" === searchQuery);
    input.focus();
  };
  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form: any = searchForm.current;
    const query = form["query"].value;

    // alert(query);

    if (_prevent_fetch_ || disableSearch) return;

    setDisableSearch(true);
    setSearchQuery(query);
    dispatch(getPolls(query));
  };

  const onSearchChange = (e: any) => {
    e.preventDefault();

    setCurrentQuery(e.target.value);
    setDisableSearch(e.target.value === searchQuery);
  };

  useEffect(() => {
    if (!_prevent_fetch_ || true) {
      dispatch(getPolls());
      return () => {
        dispatch(flushPolls());
      };
    }
  }, [_prevent_fetch_, dispatch]);

  return (
    <>
      <div className="content-fullscreen">
        <div className="content-horizontal-center pt-4">
          <form
            className="form-form-wrapper polls-header"
            onSubmit={submitSearch}
            ref={searchForm}
          >
            <div className="my-polls__search-input">
              <input
                onChange={onSearchChange}
                name="query"
                className="form-item__input form-item__input--small"
                type="text"
                placeholder="Filter Polls"
              />
              <div className="form-item__input-icon my-polls__search-action">
                <button
                  className="my-polls__search-action--clear"
                  disabled={!currentQuery}
                  type="button"
                  onClick={clearSearch}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
                <button
                  disabled={disableSearch}
                  type="submit"
                  className="my-polls__search-action--search"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </form>
        </div>
        {!_prevent_fetch_ && !polls_loading && Array.isArray(polls) ? (
          <>
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {!polls_error ? (
                  polls.length > 0 ? (
                    polls.map((poll) => (
                      <ManagePoll poll={poll} key={poll.id} />
                    ))
                  ) : (
                    <div className="noresult">{noResults}</div>
                  )
                ) : (
                  <h1>{polls_error}</h1>
                )}
                {/* {dbgPolls.map(poll => <Poll poll={poll} key={poll.id} />)} */}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Manage;
