export function pushConsentForm(jsPsych, timeline) {

  const consent = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1>Consent to Participate</h1>

        <p><strong>(Please scroll down to read all information.)</strong></p>
        
        <div style="
          max-height: 300px;
          overflow-y: scroll;
          border: 1px solid #ccc;
          padding: 15px;
          margin-bottom: 20px;
        ">

        <p>
          This research study is being conducted by researchers from
          <strong>Columbia University</strong>.
        </p>

        <p>
          The purpose of this study is to get your impressions of people talking about themselves.
        </p>

        <p>
          Participation involves watching and responding to videos.
        </p>

        <p>
          Some materials may contain emotional content. If you feel uncomfortable,
          you may stop participating at any time without penalty.
        </p>

        <p>
          Your data will be collected anonymously and used only for research purposes.
        </p>

        <p>
          If you have questions, you may contact the research team at
          <a href="mailto:columbia.freemanlab@gmail.com">
            columbia.freemanlab@gmail.com</a>.
        </p>
        </div>

        <p><strong>Do you consent to participate in this study?</strong></p>
      </div>
    `,
    choices: ["I agree", "I do not agree"],
    data: {
      trial_type: "consent"
    },
    on_finish: function(data) {
      if (data.response === 1) {
        jsPsych.endExperiment(
          "<p>You chose not to participate. You may now close this window.</p>"
        );
      }
    }
  };

  timeline.push(consent);
}
