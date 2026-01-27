//Debug mode - enable this to skip consent and demogrphic forms
var debug = false;

/////// SET UP OF EXPERIMENT ////////

// Save data to server
function saveData(data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'save_VideopostResponse.php');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ filedata: data }));
}

// Initialize jsPsych
var jsPsych = initJsPsych({
  show_progress_bar: true,
  on_finish: function () {
    console.log("End of experiment");

    var data = jsPsych.data.get().csv();
    saveData(data);

    jsPsych.endExperiment(`
      <p>You've finished the last task. Thanks for participating!</p>
      <p>
        <a href="https://app.prolific.com/submissions/complete?cc=C18VJB3V">
          Click here to return to Prolific and complete the study
        </a>
      </p>
    `);
  }
});

// Subject ID
var subject_id = jsPsych.randomization.randomID(15);
jsPsych.data.addProperties({ subject: subject_id });

// Date / time
var today = new Date();
jsPsych.data.addProperties({
  date: ("0" + today.getDate()).slice(-2) + '-' +
        ("0" + (today.getMonth() + 1)).slice(-2) + '-' +
        today.getFullYear(),
  time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
});

// Prolific ID from URL
const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('participant_id') || 'unknown';
jsPsych.data.addProperties({ prolificID: prolificID });

// Timeline
var timeline = [];

console.log("Startup OK");


//Import config file
import config from "./config.js"

//Adds consent form to timeline
import { pushConsentForm } from './consent.js';
if (!debug) {
    pushConsentForm(jsPsych, timeline)
}


// =====================
// EXPERIMENT CONTENT
// =====================

// Instructions
var instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: config.instructions,
  choices: ['Continue']
};

var instructions2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: config.instructions2,
  choices: ['Continue']
};

timeline.push(instructions, instructions2);


// ------------------------------------
// Video list
// ------------------------------------
const allVideos = [
  "movies/Travelling.mp4",
  "movies/HardMode.mp4",
  "movies/Music.mp4",
  "movies/Aging.mp4",
  "movies/Attraction.mp4",
  "movies/Cringe.mp4",
  "movies/MovingHome.mp4",
  "movies/Arrogance.mp4",
  "movies/Avoiding.mp4",
  "movies/Teaching.mp4",
  "movies/Connection.mp4",
  "movies/Socializing.mp4"
];

// ------------------------------------
// Assign to a group
// ------------------------------------

const group = Math.random() < 0.5 ? "Group_1" : "Group_2";

console.log("Participant assigned to:", group);

// Save group assignment globally
jsPsych.data.addProperties({
  group: group
});

let videos =
  group === "Group_1"
    ? allVideos.slice(0, 6)
    : allVideos.slice(6, 12);

videos = jsPsych.randomization.shuffle(videos);

// ------------------------------------
// Loop over videos
// ------------------------------------
videos.forEach((videoPath, idx) => {

  // Video trial
  const video_trial = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: [videoPath],
    choices: "NO_KEYS",
    trial_ends_after_video: true,
    data: {
      trial_type: "video",
      video_number: idx + 1,
      video_file: videoPath
    }
  };

  // Forced text responses
  const response_trial = {
    type: jsPsychSurveyText,
    preamble: `
      <p><strong>Please respond based on everything you thought at any point during the video.</strong></p>
      <p>List <u>all</u> traits, emotions, or mental states that occurred to you — not just an overall impression.</p>
    `,
    questions: [
      {
        prompt: "Personality traits (e.g., funny, honest, confident):",
        placeholder: "Enter one or more personality traits",
        required: true,
        rows: 3,
        columns: 60,
        name: "personality_traits"
      },
      {
        prompt: "Emotions or mental states (e.g., embarrassment, happiness, indifference):",
        placeholder: "Enter one or more emotions or mental states",
        required: true,
        rows: 3,
        columns: 60,
        name: "emotions_mental_states"
      }
    ],
    data: {
      trial_type: "response",
      video_number: idx + 1,
      video_file: videoPath
    }
  };

  timeline.push(video_trial, response_trial);
});


//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
if (!debug) {
pushDemographicSurvey(timeline);
}


//Adds final trial to mark successful completion
var completion = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `You've finished the last task. Click the button to end the study.`,
    choices: ["End"],
}
timeline.push(completion)

//Run
jsPsych.run(timeline);
