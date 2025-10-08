//Debug mode - enable this to skip consent and demogrphic forms
var debug = true;

//Initialize
var sub_id = Math.random().toString().substr(2, 15); // generate random 15 digit number
var jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.endExperiment(`<p>Thanks for participating!</p>
            <p><a href="https://app.prolific.co/submissions/complete?cc=XXXXXX">Click here to return to Prolific and complete the study</a>.</p>`);
        console.log("End of experiment");
        jsPsych.data.get().localSave("csv", "sub-" + sub_id + "_data.csv");
    },
});
var timeline = [];

//Import config file
import config from "./config.js"

//Adds consent form to timeline
import { pushConsentForm } from '../consent.js';
if (!debug) {
    pushConsentForm(jsPsych, timeline, config.experimentName)
}

//EXPERIMENT CONTENT GOES HERE

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: config.instructions,
    choices: ['Continue']
};

timeline.push(instructions);

var resume = {
    type: jsPsychInstructionsTimed,
    pages: jsPsych.timelineVariable('stimulus'),
    key_forward: "ArrowDown",
    key_backward: "ArrowUp",
    continue_button_delay: 5000,
    button_label_continue: "Continue",
    instructions_text: "Use the up and down arrow keys to look through the resume. When you are done, click the button below to continue.",
    show_page_number: true,
};

var likert_scale = [
  "1 (Not at all)", 
  "2", 
  "3", 
  "4", 
  "5",
  "6",
  "7 (Extremely)"
];

// Create questions for each trait
var rating_questions = config.traits.map(function(trait) {
  return {
    prompt: `How ${trait} is this person?`,
    name: trait,
    labels: likert_scale,
    required: true
  };
});

var rate = {
    type: jsPsychSurveyLikert,
    questions: rating_questions,
    randomize_question_order: true,
    scale_width: 500
};

// Create array of resume stimuli
var resumeStimuli = Array.from({length: config.trials}, (_, i) => i + 1).map(resumeID => {
    const paddedID = String(resumeID).padStart(2, '0');
    const imageGroup = [1, 2, 3, 4].map(pageNumber => {
        return `<img src='imgs/Resume_${paddedID}_${pageNumber}.png' style='display: block; width: 75%; height: auto; margin-left: auto; margin-right: auto;'>`;
    });
    return { stimulus: imageGroup };
});

var fullTrial = {
    timeline: [resume, rate],
    timeline_variables: resumeStimuli,
    sample: {
        type: 'without-replacement',
        size: 2
    }
}
timeline.push(fullTrial);

//END OF EXPERIMENT CONTENT

//Adds demographics survey to timeline
import { pushDemographicSurvey } from '../demographics.js'
if (!debug) {
    pushDemographicSurvey(timeline);
}

//Run
jsPsych.run(timeline);
