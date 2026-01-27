//Debug mode - enable this to skip consent and demogrphic forms
var debug = false;

/////// SET UP OF EXPERIMENT ////////

// Save data to server
function saveData(data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'save_VideopostLikertphp');
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


timeline.push(instructions);


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

let videos = group === "Group_1" ? allVideos.slice(0, 6) : allVideos.slice(6, 12);

// shuffle video order
const watchingOrder = jsPsych.randomization.shuffle(videos);

// preload videos
const allImages = allVideos.map(v => v.replace('.mp4', '.jpg'));

var preload = {
  type: jsPsychPreload,
  video: allVideos,
  images: allImages
};
timeline.unshift(preload);

// ------------------------------------
// Loop over videos
// ------------------------------------
watchingOrder.forEach((videoPath, idx) => {

  const videoLabel = videoPath.split('/').pop().replace('.mp4', '');

  // Video trial
  const video_trial = {
    type: jsPsychVideoButtonResponse,
    stimulus: [videoPath],
    rate: 1,
    prompt: `<p>Please watch video ${idx + 1} of 6 carefully. You will be asked to rate each person on their personality traits and mental states in the video after watching all the videos.</p>`,
    choices: ["Continue"],
    trial_ends_after_video: false,
    response_ends_trial: true,
    //enable_button_after: 120,    
    response_allowed_while_playing: false,
    data: {
      trial_type: "video",
      video_number: idx + 1,
      video_rated: videoLabel
    }
  };



  timeline.push(video_trial);
});

// ------------------------------------
// Rate each video in a random order
// ------------------------------------

  // Personality rating trial

  var likert_scale = [
  "Strongly Disagree", 
  "Disagree",
  "Somewhat Disagree", 
  "Neither Agree nor Disagree", 
  "Somewhat Agree",
  "Agree", 
  "Strongly Agree"
];

const ratingOrder = jsPsych.randomization.shuffle([...videos]);

ratingOrder.forEach((videoPath) => {
  
  const videoLabel = videoPath.split('/').pop().replace('.mp4', '');
  const imagePath = videoPath.replace('.mp4', '.jpg');

  var trait_page = {
    type: jsPsychSurveyLikert,
    preamble: `
      <div style="margin-bottom: 20px;">
        <p><strong>Please consider the subject shown in this video:</strong></p>
        <img src="${imagePath}" style="width: 400px; border-radius: 4px;">
      </div>
      <p>How much do you agree or disagree with the following statements regarding their personality traits?</p>`,  
    questions: [
        {prompt: "The subject of this video is bold.", name: 'Bold', labels: likert_scale, required: true},
        {prompt: "The subject of this video is mature.", name: 'Mature', labels: likert_scale, required: true},
        {prompt: "The subject of this video is upbeat.", name: 'Upbeat', labels: likert_scale, required: true},
        {prompt: "The subject of this video is disciplined.", name: 'Disciplined', labels: likert_scale, required: true},
        {prompt: "The subject of this video is sympathetic.", name: 'Sympathetic', labels: likert_scale, required: true},
        {prompt: "The subject of this video is patient.", name: 'Patient', labels: likert_scale, required: true},
        {prompt: "The subject of this video is proud.", name: 'Proud', labels: likert_scale, required: true},
        {prompt: "The subject of this video is open minded.", name: 'OpenMinded', labels: likert_scale, required: true},
        {prompt: "The subject of this video is funny.", name: 'Funny', labels: likert_scale, required: true},
        {prompt: "The subject of this video is laid back.", name: 'LaidBack', labels: likert_scale, required: true},
        {prompt: "The subject of this video is introverted.", name: 'Introverted', labels: likert_scale, required: true},
        {prompt: "The subject of this video is uncreative.", name: 'Uncreative', labels: likert_scale, required: true},
        {prompt: "The subject of this video is driven.", name: 'Driven', labels: likert_scale, required: true},
        {prompt: "The subject of this video is warm.", name: 'Warm', labels: likert_scale, required: true},
        {prompt: "The subject of this video is easily-upset.", name: 'EasilyUpset', labels: likert_scale, required: true},
        {prompt: "The subject of this video is intelligent.", name: 'Intelligent', labels: likert_scale, required: true},
        {prompt: "The subject of this video is negative.", name: 'Negative', labels: likert_scale, required: true},
        {prompt: "The subject of this video is authentic.", name: 'Authentic', labels: likert_scale, required: true},
        {prompt: "The subject of this video is confident.", name: 'Confident', labels: likert_scale, required: true},
        {prompt: "The subject of this video is picky.", name: 'Picky', labels: likert_scale, required: true},
      ],
    randomize_question_order: true,
    data: {
      trial_type: "trait_rating",
      video_rated: videoLabel }
    };

  var state_page = {
    type: jsPsychSurveyLikert,
    preamble: `
      <div style="margin-bottom: 20px;">
        <p><strong>Please consider the subject shown in this video:</strong></p>
        <img src="${imagePath}" style="width: 400px; border-radius: 4px;">
      </div>
      <p>How much do you agree or disagree with the following statements regarding their mental states?</p>`,  
    questions: [
        {prompt: "The subject of this video was feeling cynical.", name: 'Cynical', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling annoyed.", name: 'Annoyed', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling analytical.", name: 'Analytical', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling insecure.", name: 'Insecure', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling optimistic.", name: 'Optimistic', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling unmotivated.", name: 'Unmotivated', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling happy.", name: 'Happy', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling curious.", name: 'Curious', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling opinionated.", name: 'Opinionated', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling uncertain.", name: 'Uncertain', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling anxious.", name: 'Anxious', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling reflective.", name: 'Reflective', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling weary.", name: 'Weary', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling empathy.", name: 'Empathy', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling relaxed.", name: 'Relaxed', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling arrogant.", name: 'Arrogant', labels: likert_scale, required:true},
        {prompt: "The subject of this video was feeling playful.", name: 'Playful', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling awkward.", name: 'Awkward', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling obsessed.", name: 'Obsessed', labels: likert_scale, required: true},
        {prompt: "The subject of this video was feeling embarrassed.", name: 'Embarrassed', labels: likert_scale, required: true},
      ],
    randomize_question_order: true,
    data: {
      trial_type: "state_rating",
      video_rated: videoLabel
    }

  };

timeline.push(trait_page, state_page);
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
