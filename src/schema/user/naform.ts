import {
  InferInput,
  minLength,
  object,
  string,
  pipe,
  number,
  minValue,
  boolean,
  array,
  optional,
} from "valibot";

const NAApplicantSchema = object({
  firstName: pipe(
    string("Please enter your first name."),
    minLength(1, "Please enter your first name.")
  ),
  lastName: pipe(
    string("Please enter your last name."),
    minLength(1, "Please enter your last name.")
  ),
  contact: optional(string("Please enter your contact number.")),
  relation: optional(string("Please enter your relation.")),
  signature_url: optional(string("Please upload your signature.")),
});

const NASurveySchema = object({
  survey_no: pipe(
    string("Please enter your survey_no."),
    minLength(1, "Please enter your survey_no.")
  ),
  area: pipe(
    string("Please enter your area in Sq.mt."),
    minLength(1, "Please enter your area in Sq.mt.")
  ),
  sub_division: pipe(
    string("Please enter your Sub Division"),
    minLength(1, "Please enter your Sub Division")
  ),
});

const NASchema = object({
  villageId: pipe(
    number("Please select your village."),
    minValue(1, "Please select your village.")
  ),
  q1: pipe(boolean("Please enter q1.")),
  q2: pipe(string("Please enter q2."), minLength(1, "Please enter q2.")),
  q3: pipe(string("Please enter q3."), minLength(1, "Please enter q3.")),
  anx1: pipe(string("Please enter anx1."), minLength(1, "Please enter anx1.")),
  anx2: pipe(string("Please enter anx2."), minLength(1, "Please enter anx2.")),
  anx3: pipe(string("Please enter anx3."), minLength(1, "Please enter anx3.")),
  anx4: pipe(string("Please enter anx4."), minLength(1, "Please enter anx4.")),
  anx5: pipe(string("Please enter anx5."), minLength(1, "Please enter anx5.")),
  q4: pipe(string("Please enter q4."), minLength(1, "Please enter q4.")),
  q5: pipe(string("Please enter q5."), minLength(1, "Please enter q5.")),
  q6: pipe(string("Please enter q6."), minLength(1, "Please enter q6.")),
  q7: pipe(string("Please enter q7."), minLength(1, "Please enter q7.")),
  q8: pipe(string("Please enter q8."), minLength(1, "Please enter q8.")),
  q9: pipe(string("Please enter q9."), minLength(1, "Please enter q9.")),
  q10: pipe(string("Please enter q10."), minLength(1, "Please enter q10.")),
  q11: pipe(string("Please enter q11."), minLength(1, "Please enter q11.")),
  q12: pipe(string("Please enter q12."), minLength(1, "Please enter q12.")),
  q13: pipe(string("Please enter q13."), minLength(1, "Please enter q13.")),
  q14: pipe(string("Please enter q14."), minLength(1, "Please enter q14.")),
  q15: pipe(string("Please enter q15."), minLength(1, "Please enter q15.")),
  q16: pipe(string("Please enter q16."), minLength(1, "Please enter q16.")),
  q17: pipe(string("Please enter q17."), minLength(1, "Please enter q17.")),
  q18: pipe(string("Please enter q18."), minLength(1, "Please enter q18.")),
  applicants: array(NAApplicantSchema),
  surveys: array(NASurveySchema),
});

type NAForm = InferInput<typeof NASchema>;
export { NASchema, type NAForm };
