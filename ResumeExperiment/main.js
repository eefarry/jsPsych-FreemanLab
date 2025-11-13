// Debug mode - enable this to skip consent and demographic forms
var debug = true;

// Generate random 15-digit participant ID
var sub_id = Math.random().toString().substr(2, 15);

/////// SERVER DATA SAVE FUNCTION ////////
function saveData(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save.php'); // save.php must be in the same folder as index.html
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        console.log('Server response:', xhr.responseText);
    };
    xhr.send(JSON.stringify({ filedata: data }));
}

/////// INIT JSPSYCH ////////
var jsPsych = initJsPsych({
    on_finish: function () {
        const data = jsPsych.data.get().csv();
        saveData(data); // send CSV to server

        // Show Prolific completion message
        jsPsych.endExperiment(`<p>Thanks for participating!</p>
            <p><a href="https://app.prolific.co/submissions/complete?cc=C8W4K9RJ">
            Click here to return to Prolific and complete the study</a>.</p>`);
        console.log("End of experiment");
    }
});


// --- Add Prolific ID as experiment-wide property ---
const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get('participant_id') || 'unknown';
jsPsych.data.addProperties({ prolificID: prolificID });


var timeline = [];

// Import config file
import config from "./config.js";

// Add consent form to timeline
import { pushConsentForm } from '../consent.js';
if (!debug) {
    pushConsentForm(jsPsych, timeline, config.experimentName)
}

/////// EXPERIMENT CONTENT ///////

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
    continue_button_delay: 10000,
    button_label_continue: "Continue",
    instructions_text: "Use the up and down arrow keys to look through the resume. When you are done, click the button below to continue.",
    show_page_number: true,
    render_on_load: true,
    on_finish: function (data) {
        const pagesSeen = new Set(data.view_history.map(v => v.page_index));
        const seenAll = pagesSeen.size >= 4;
        const waitedLongEnough = data.rt >= 10000;
        if (!seenAll || !waitedLongEnough) {
            jsPsych.timelineVariable('stimulus').repeatTrial = true;
        }
    }
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
var rating_questions = config.traits.map(function (trait) {
    return {
        prompt: `How ${trait.label} is this person?`,
        name: trait.name,
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

const testFolder = Math.random() < 0.5 ? "Test_1" : "Test_2";
const startIndex = testFolder === "Test_1" ? 1 : 26;
const totalResumes = 25;

console.log("Participant assigned to:", testFolder, "starting at", startIndex);

var resumeStimuli = jsPsych.randomization.shuffle(
    Array.from({ length: totalResumes }, (_, i) => {
        const resumeID = startIndex + i;
        const paddedID = String(resumeID).padStart(2, "0");

        const imageGroup = [1, 2, 3, 4].map(pageNumber => `
            <img src="imgs/${testFolder}/Resume_${paddedID}_${pageNumber}.png"
                 style="display:block;width:75%;height:auto;margin:0 auto;"
                 alt="Resume page ${pageNumber}">
        `);

        return { stimulus: imageGroup, resume_id: `${testFolder}_${paddedID}` };
    })
);

var fullTrial = {
    timeline: [resume, rate],
    timeline_variables: resumeStimuli
};
timeline.push(fullTrial);

/////// DEMOGRAPHICS ///////
import { pushDemographicSurvey } from '../demographics.js'
if (!debug) {
    pushDemographicSurvey(timeline);
}

/////// RUN ///////
jsPsych.run(timeline);
