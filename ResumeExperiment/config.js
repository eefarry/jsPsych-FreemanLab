const config = {
    //The name of the experiment, which will show in the welcome message
    experimentName: "Resume Experiment",

    //The instructions to be shown before the experiment begins
    instructions: "You will be shown 10 resumes. After examining each one, you'll be asked to rate the candidate on several traits. Use the up and down arrow keys to scroll through the four sections of each resume. After 10 seconds, a \"Continue\" button will appear, allowing you to proceed to the rating questions.",
    //The number of trials (and resumes)
    trials: 2,

    //Traits to rate
traits: [
  { name: "competence", label: "competent" },
  { name: "conscientiousness", label: "conscientious / attentive to detail" },
  { name: "professionalism", label: "professional" },
  { name: "leadership_potential", label: "strong a leader" },
  { name: "stability", label: "stable / consistent in career" },
  { name: "technical_skill", label: "technically skilled" },
  { name: "communication", label: "clear in communication" },
  { name: "warmth", label: "warm / likable" }
]

}

export default config;