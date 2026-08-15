import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Mic,
  Square,
} from "lucide-react";

import {
  questionsByCategory,
} from "../data/questions";

import {
  evaluateAnswer,
} from "../utils/evaluateAnswer";

import {
  saveInterview,
} from "../utils/storage";

import {
  getAuth,
} from "firebase/auth";


function Interview() {

  const navigate = useNavigate();

  const {
    category = "html",
  } = useParams();


  /*
   * Number of questions asked
   * in one interview.
   */
  const QUESTIONS_PER_INTERVIEW = 5;


  /*
   * Number of completed interviews
   * before the question cycle resets.
   */
  const INTERVIEWS_BEFORE_RESET = 5;


  /*
   * Normalize category name.
   */
  const normalizedCategory =
    category.toLowerCase();


  /*
   * Current logged-in user.
   */
  const user =
    getAuth().currentUser;


  const userId =
    user?.uid || "guest";


  /*
   * Storage key for completed/used
   * questions of this category.
   */
  const usedQuestionsStorageKey =
    `usedQuestions_${userId}_${normalizedCategory}`;


  /*
   * Storage key for number of
   * completed interviews in this cycle.
   */
  const interviewCountStorageKey =
    `interviewCount_${userId}_${normalizedCategory}`;


  /*
   * Select questions for this interview.
   */
  const questionsList = useMemo(() => {

    const allQuestions =
      questionsByCategory[
        normalizedCategory
      ] ||
      questionsByCategory.html;


    if (
      !Array.isArray(allQuestions) ||
      allQuestions.length === 0
    ) {
      return [];
    }


    let usedQuestionIds = [];


    try {

      const savedUsedQuestions =
        JSON.parse(
          localStorage.getItem(
            usedQuestionsStorageKey
          )
        );


      if (
        Array.isArray(
          savedUsedQuestions
        )
      ) {

        usedQuestionIds =
          savedUsedQuestions;

      }

    } catch (error) {

      console.error(
        "Unable to read used questions:",
        error
      );

    }


    /*
     * Find questions that have
     * not been used yet.
     */
    let availableQuestions =
      allQuestions.filter(
        (question) =>
          !usedQuestionIds.includes(
            question.id
          )
      );


    /*
     * If fewer than 5 questions remain,
     * start a fresh pool.
     */
    if (
      availableQuestions.length <
      QUESTIONS_PER_INTERVIEW
    ) {

      usedQuestionIds = [];

      availableQuestions =
        [...allQuestions];

    }


    /*
     * Shuffle available questions.
     */
    const shuffledQuestions =
      [...availableQuestions].sort(
        () => Math.random() - 0.5
      );


    /*
     * Select questions.
     */
    return shuffledQuestions.slice(
      0,
      Math.min(
        QUESTIONS_PER_INTERVIEW,
        shuffledQuestions.length
      )
    );

  }, [
    normalizedCategory,
    usedQuestionsStorageKey,
  ]);


  /*
   * Current question index.
   */
  const [
    currentIdx,
    setCurrentIdx,
  ] = useState(0);


  /*
   * User answer.
   */
  const [
    answer,
    setAnswer,
  ] = useState("");


  /*
   * Current evaluation.
   */
  const [
    evaluation,
    setEvaluation,
  ] = useState(null);


  /*
   * IMPORTANT:
   *
   * This tells us whether the answer
   * was actually accepted.
   *
   * It is different from evaluation
   * because an invalid answer can be
   * evaluated and then edited again.
   */
  const [
    isAnswerAccepted,
    setIsAnswerAccepted,
  ] = useState(false);


  /*
   * Recording state.
   */
  const [
    isRecording,
    setIsRecording,
  ] = useState(false);


  /*
   * Number of passed questions.
   */
  const [
    passedCount,
    setPassedCount,
  ] = useState(0);


  /*
   * Number of skipped questions.
   */
  const [
    skippedCount,
    setSkippedCount,
  ] = useState(0);


  /*
   * Prevent interview from
   * finishing multiple times.
   */
  const [
    isFinished,
    setIsFinished,
  ] = useState(false);


  /*
   * Prevent Evaluate Answer
   * from being clicked twice
   * while evaluation is running.
   */
  const [
    isEvaluating,
    setIsEvaluating,
  ] = useState(false);


  /*
   * Speech recognition reference.
   */
  const recognitionRef =
    useRef(null);


  /*
   * Current question object.
   */
  const currentQuestionObj =
    questionsList[currentIdx];


  /*
   * Store completed question IDs.
   */
  const completedQuestionIdsRef =
    useRef([]);


  /*
   * Store latest passed/skipped
   * counts.
   */
  const passedCountRef =
    useRef(0);

  const skippedCountRef =
    useRef(0);


  /*
   * Keep refs synchronized with state.
   */
  useEffect(() => {

    passedCountRef.current =
      passedCount;

  }, [passedCount]);


  useEffect(() => {

    skippedCountRef.current =
      skippedCount;

  }, [skippedCount]);


  /*
   * Speech Recognition setup.
   */
  useEffect(() => {

    if (
      !(
        "webkitSpeechRecognition" in
        window
      ) &&
      !(
        "SpeechRecognition" in
        window
      )
    ) {
      return;
    }


    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    const recognition =
      new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onresult = (
      event
    ) => {

      let transcript = "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        transcript +=
          event.results[i][0]
            .transcript;

      }


      setAnswer(transcript);

    };


    recognition.onend = () => {

      setIsRecording(false);

    };


    recognition.onerror = (
      event
    ) => {

      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsRecording(false);

    };


    recognitionRef.current =
      recognition;


    return () => {

      try {

        recognition.stop();

      } catch (error) {

        console.error(
          "Unable to stop recognition:",
          error
        );

      }

      recognitionRef.current =
        null;

    };

  }, []);


  /*
   * Start voice recording.
   */
  const startRecording = () => {

    if (
      !recognitionRef.current
    ) {

      alert(
        "Speech recognition is not supported in this browser."
      );

      return;

    }


    try {

      recognitionRef.current.start();

      setIsRecording(true);

    } catch (error) {

      console.error(
        "Unable to start recording:",
        error
      );

    }

  };


  /*
   * Stop voice recording.
   */
  const stopRecording = () => {

    if (
      recognitionRef.current
    ) {

      try {

        recognitionRef.current.stop();

      } catch (error) {

        console.error(
          "Unable to stop recording:",
          error
        );

      }

    }


    setIsRecording(false);

  };


  /*
   * Finish the interview.
   */
  const finishInterview = async (
    finalPassed = passedCountRef.current,
    finalSkipped = skippedCountRef.current
  ) => {

    if (isFinished) {
      return;
    }


    setIsFinished(true);


    if (isRecording) {
      stopRecording();
    }


    const totalQuestions =
      questionsList.length;


    /*
     * Save completed question IDs.
     */
    try {

      const existingUsed =
        JSON.parse(
          localStorage.getItem(
            usedQuestionsStorageKey
          )
        ) || [];


      const safeExistingUsed =
        Array.isArray(existingUsed)
          ? existingUsed
          : [];


      const updatedUsedQuestions = [
        ...new Set([
          ...safeExistingUsed,
          ...completedQuestionIdsRef.current,
        ]),
      ];


      localStorage.setItem(
        usedQuestionsStorageKey,
        JSON.stringify(
          updatedUsedQuestions
        )
      );

    } catch (error) {

      console.error(
        "Unable to save used questions:",
        error
      );

    }


    /*
     * Update completed interview count.
     */
    try {

      let interviewCount =
        Number(
          localStorage.getItem(
            interviewCountStorageKey
          )
        ) || 0;


      interviewCount += 1;


      /*
       * Reset question cycle after
       * configured number of interviews.
       */
      if (
        interviewCount >=
        INTERVIEWS_BEFORE_RESET
      ) {

        interviewCount = 0;

        localStorage.removeItem(
          usedQuestionsStorageKey
        );

      }


      localStorage.setItem(
        interviewCountStorageKey,
        String(interviewCount)
      );

    } catch (error) {

      console.error(
        "Unable to update interview count:",
        error
      );

    }


    /*
     * Calculate final score.
     */
    const attempted =
      totalQuestions -
      finalSkipped;


    const score =
      totalQuestions === 0
        ? 0
        : Math.round(
            (finalPassed /
              totalQuestions) *
              100
          );


    /*
     * Save interview.
     */
    try {

      saveInterview(
        category,
        score
      );

    } catch (error) {

      console.error(
        "Unable to save interview:",
        error
      );

    }


    /*
     * Navigate to Results page.
     */
    navigate(
      "/results",
      {
        state: {
          category,
          score,
          totalQuestions,
          passedCount:
            finalPassed,
          skippedCount:
            finalSkipped,
          attempted,
        },
      }
    );

  };


  /*
   * Evaluate current answer.
   *
   * IMPORTANT:
   *
   * The actual keywords remain hidden.
   *
   * If zero keywords match:
   * - answer is rejected
   * - user can edit answer
   * - user can evaluate again
   * - Next Question stays disabled
   *
   * If at least one keyword matches:
   * - answer is accepted
   * - answer becomes locked
   * - Next Question becomes enabled
   */
  const handleEvaluate = () => {

    if (
      isEvaluating ||
      isAnswerAccepted ||
      isFinished
    ) {
      return;
    }


    if (!answer.trim()) {

      alert(
        "Please provide an answer first."
      );

      return;

    }


    if (!currentQuestionObj) {
      return;
    }


    setIsEvaluating(true);


    try {

      const result =
        evaluateAnswer(
          answer,
          currentQuestionObj.keywords
        );


      /*
       * Save evaluation result.
       *
       * Keywords themselves are NOT
       * displayed anywhere.
       */
      setEvaluation(result);


      /*
       * If answer is NOT accepted:
       *
       * Keep textarea unlocked so the
       * user can improve the answer.
       */
      if (!result?.passed) {

        setIsAnswerAccepted(false);

        setIsEvaluating(false);

        return;

      }


      /*
       * Answer is accepted.
       */
      setIsAnswerAccepted(true);


      /*
       * Remember completed question.
       */
      if (
        currentQuestionObj.id &&
        !completedQuestionIdsRef.current.includes(
          currentQuestionObj.id
        )
      ) {

        completedQuestionIdsRef.current.push(
          currentQuestionObj.id
        );

      }


      /*
       * Update passed count.
       */
      const newPassedCount =
        passedCountRef.current + 1;


      passedCountRef.current =
        newPassedCount;


      setPassedCount(
        newPassedCount
      );


      setIsEvaluating(false);


      /*
       * LAST QUESTION
       *
       * Only finish automatically
       * when the final answer has
       * been accepted.
       */
      setIsEvaluating(false);

    } catch (error) {

      console.error(
        "Answer evaluation error:",
        error
      );

      alert(
        "Unable to evaluate the answer. Please try again."
      );

      setIsEvaluating(false);

    }

  };


  /*
   * Skip current question.
   */
  const handleSkip = () => {

    if (
      isFinished ||
      isAnswerAccepted
    ) {
      return;
    }


    if (isRecording) {
      stopRecording();
    }


    const newSkippedCount =
      skippedCountRef.current + 1;


    skippedCountRef.current =
      newSkippedCount;


    setSkippedCount(
      newSkippedCount
    );


    /*
     * Move to next question.
     */
    if (
      currentIdx <
      questionsList.length - 1
    ) {

      setAnswer("");

      setEvaluation(null);

      setIsAnswerAccepted(false);

      setIsEvaluating(false);


      setCurrentIdx(
        (prev) => prev + 1
      );


      return;

    }


    /*
     * If last question is skipped,
     * finish the interview.
     */
    finishInterview(
      passedCountRef.current,
      newSkippedCount
    );

  };


  /*
   * Move to next question.
   *
   * An accepted answer is required.
   */
  const handleNext = () => {

    if (
      isFinished ||
      !isAnswerAccepted
    ) {
      return;
    }


    if (isRecording) {
      stopRecording();
    }


    /*
     * Last question.
     */
    if (
      currentIdx >=
      questionsList.length - 1
    ) {

      finishInterview(
        passedCountRef.current,
        skippedCountRef.current
      );

      return;

    }


    /*
     * Clear current question data.
     */
    setAnswer("");

    setEvaluation(null);

    setIsAnswerAccepted(false);

    setIsEvaluating(false);


    /*
     * Move to next question.
     */
    setCurrentIdx(
      (prev) => prev + 1
    );

  };


  /*
   * Timer.
   */
  const [
    timeLeft,
    setTimeLeft,
  ] = useState(
    15 * 60
  );


  useEffect(() => {

    if (isFinished) {
      return;
    }


    if (timeLeft <= 0) {

      finishInterview(
        passedCountRef.current,
        skippedCountRef.current
      );

      return;

    }


    const timer =
      setInterval(() => {

        setTimeLeft(
          (prev) => prev - 1
        );

      }, 1000);


    return () =>
      clearInterval(timer);

  }, [
    timeLeft,
    isFinished,
  ]);


  /*
   * Format timer.
   */
  const minutes =
    Math.floor(
      timeLeft / 60
    );


  const seconds =
    timeLeft % 60;


  const formattedTime =
    `${String(
      minutes
    ).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;


  /*
   * Prevent copy.
   */
  const handleCopy = (
    event
  ) => {

    event.preventDefault();

  };


  /*
   * Prevent paste.
   */
  const handlePaste = (
    event
  ) => {

    event.preventDefault();

    alert(
      "Copy and paste are disabled for interview answers."
    );

  };


  /*
   * Prevent cut.
   */
  const handleCut = (
    event
  ) => {

    event.preventDefault();

  };


  /*
   * Prevent right-click.
   */
  const handleContextMenu = (
    event
  ) => {

    event.preventDefault();

  };


  /*
   * Prevent keyboard shortcuts.
   */
  const handleKeyDown = (
    event
  ) => {

    if (
      (event.ctrlKey ||
        event.metaKey) &&
      [
        "c",
        "v",
        "x",
        "a",
      ].includes(
        event.key.toLowerCase()
      )
    ) {

      event.preventDefault();

    }

  };


  /*
   * If no question exists.
   */
  if (!currentQuestionObj) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No questions available
          </h2>


          <button
            onClick={() =>
              navigate("/interview")
            }
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Back to Interviews
          </button>

        </div>

      </div>
    );

  }


  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        dark:bg-slate-950
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >

      <div className="max-w-5xl mx-auto">


        {/* Header */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-6
          "
        >

          <div>

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              {category
                .charAt(0)
                .toUpperCase() +
                category.slice(1)
              } Interview
            </h1>


            <p
              className="
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >
              Question{" "}
              {currentIdx + 1}{" "}
              of{" "}
              {questionsList.length}
            </p>

          </div>


          {/* Timer */}

          <div
            className={`
              px-5
              py-3
              rounded-xl
              font-bold
              text-lg
              ${
                timeLeft <= 60
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              }
            `}
          >
            {formattedTime}
          </div>

        </div>


        {/* Progress Bar */}

        <div
          className="
            w-full
            bg-gray-200
            dark:bg-slate-800
            rounded-full
            h-2
            mb-6
          "
        >

          <div
            className="
              bg-blue-600
              h-2
              rounded-full
              transition-all
              duration-300
            "
            style={{
              width: `${
                ((currentIdx + 1) /
                  questionsList.length) *
                100
              }%`,
            }}
          />

        </div>


        {/* Main Interview Card */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            border
            border-gray-200
            dark:border-slate-800
            shadow-lg
            p-6
            sm:p-8
          "
        >


          {/* Question */}

          <div className="mb-8">

            <span
              className="
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                bg-blue-100
                dark:bg-blue-900/30
                text-blue-600
                dark:text-blue-400
                text-sm
                font-semibold
                mb-4
              "
            >
              Question{" "}
              {currentIdx + 1}
            </span>


            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-gray-900
                dark:text-white
                leading-relaxed
              "
            >
              {
                currentQuestionObj.question
              }
            </h2>

          </div>


          {/* Answer Area */}

          <div className="space-y-4">

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
              onCopy={handleCopy}
              onPaste={handlePaste}
              onCut={handleCut}
              onContextMenu={
                handleContextMenu
              }
              onKeyDown={
                handleKeyDown
              }
              onDragStart={
                handleCopy
              }
              onDrop={
                handlePaste
              }
              placeholder="Type your answer here..."
              rows={7}
              disabled={
                isAnswerAccepted ||
                isFinished
              }
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-gray-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-950
                text-gray-900
                dark:text-white
                placeholder-gray-400
                dark:placeholder-gray-500
                p-4
                focus:outline-none
                focus:ring-4
                focus:ring-blue-500/20
                focus:border-blue-500
                transition
                disabled:bg-gray-100
                disabled:dark:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-80
              "
            />


            {/* Recording + Evaluate */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
              "
            >

              {!isRecording ? (

                <button
                  onClick={
                    startRecording
                  }
                  disabled={
                    isAnswerAccepted ||
                    isFinished
                  }
                  className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-red-600
                    hover:bg-red-700
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    transition
                  "
                >

                  <Mic size={20} />

                  Start Recording

                </button>

              ) : (

                <button
                  onClick={
                    stopRecording
                  }
                  disabled={
                    isAnswerAccepted ||
                    isFinished
                  }
                  className="
                    flex-1
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-gray-700
                    hover:bg-gray-800
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    transition
                  "
                >

                  <Square
                    size={18}
                  />

                  Stop Recording

                </button>

              )}


              {/* Evaluate Answer */}

              <button
                onClick={
                  handleEvaluate
                }
                disabled={
                  !answer.trim() ||
                  isAnswerAccepted ||
                  isEvaluating ||
                  isFinished
                }
                className="
                  flex-1
                  px-5
                  py-3
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  transition
                "
              >

                {isEvaluating
                  ? "Evaluating..."
                  : isAnswerAccepted
                  ? "Answer Accepted"
                  : "Evaluate Answer"}

              </button>

            </div>

          </div>


          {/* Evaluation */}

          {evaluation && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-gray-200
                dark:border-slate-700
                bg-gray-50
                dark:bg-slate-950
                p-5
              "
            >

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                "
              >

                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Evaluation
                </h3>


                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                    ${
                      evaluation.passed
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }
                  `}
                >
                  {evaluation.passed
                    ? "Answer Accepted"
                    : "Invalid Answer"}
                </span>

              </div>


              {/* Only show general feedback.
                  Never show keywords or percentages. */}

              {evaluation.message && (

                <p
                  className="
                    mt-4
                    text-gray-600
                    dark:text-gray-400
                    leading-relaxed
                  "
                >
                  {
                    evaluation.message
                  }
                </p>

              )}


              {/* Retry message */}

              {!evaluation.passed && (

                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-red-600
                    dark:text-red-400
                  "
                >
                  Please improve your answer and evaluate again.
                </p>

              )}


              {/* Last Question Message */}

              {evaluation.passed &&
                currentIdx ===
                  questionsList.length - 1 && (

                <p
                  className="
                    mt-4
                    text-sm
                    font-semibold
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  Final answer accepted. Generating your result...
                </p>

              )}

            </div>

          )}


          {/* Navigation Buttons */}

          <div
            className="
              flex
              flex-col-reverse
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              mt-8
              pt-6
              border-t
              border-gray-200
              dark:border-slate-800
            "
          >

            {/* Skip */}

            <button
              onClick={
                handleSkip
              }
              disabled={
                isAnswerAccepted ||
                isFinished
              }
              className="
                px-5
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-slate-700
                text-gray-700
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-slate-800
                disabled:bg-gray-200
                disabled:dark:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
                font-semibold
                transition
              "
            >
              Skip Question
            </button>


            {/* Next / Finish */}

            <button
              onClick={
                handleNext
              }
              disabled={
                !isAnswerAccepted ||
                isFinished
              }
              className="
                px-6
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-gray-400
                disabled:cursor-not-allowed
                text-white
                font-semibold
                transition
              "
            >

              {currentIdx ===
              questionsList.length - 1
                ? "Finish Interview"
                : "Next Question"}

            </button>

          </div>

        </div>


        {/* Interview Statistics */}

        <div
          className="
            grid
            grid-cols-3
            gap-3
            mt-6
          "
        >

          {/* Current */}

          <div
            className="
              bg-white
              dark:bg-slate-900
              border
              border-gray-200
              dark:border-slate-800
              rounded-2xl
              p-4
              text-center
            "
          >

            <p
              className="
                text-2xl
                font-bold
                text-blue-600
              "
            >
              {currentIdx + 1}
            </p>


            <p
              className="
                text-xs
                sm:text-sm
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >
              Current
            </p>

          </div>


          {/* Passed */}

          <div
            className="
              bg-white
              dark:bg-slate-900
              border
              border-gray-200
              dark:border-slate-800
              rounded-2xl
              p-4
              text-center
            "
          >

            <p
              className="
                text-2xl
                font-bold
                text-green-600
              "
            >
              {passedCount}
            </p>


            <p
              className="
                text-xs
                sm:text-sm
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >
              Passed
            </p>

          </div>


          {/* Skipped */}

          <div
            className="
              bg-white
              dark:bg-slate-900
              border
              border-gray-200
              dark:border-slate-800
              rounded-2xl
              p-4
              text-center
            "
          >

            <p
              className="
                text-2xl
                font-bold
                text-orange-600
              "
            >
              {skippedCount}
            </p>


            <p
              className="
                text-xs
                sm:text-sm
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >
              Skipped
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Interview;