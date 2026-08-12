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
  nullish,
} from "valibot";

const NAApplicantSchema = object({
  firstName: pipe(
    string("Please enter your first name."),
    minLength(1, "Please enter your first name.")
  ),
  lastName: optional(string("Please enter your last name.")),
  contact: optional(string("Please enter your contact number.")),
  relation: optional(string("Please enter your relation.")),
  signature_url: pipe(
    string("Please upload your signature."),
    minLength(1, "Please upload your signature.")
  ),
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
  sub_division: nullish(string("Please enter your Sub Division")),
});

const NASchema = object({
  villageId: pipe(
    number("Please select your village."),
    minValue(1, "Please select your village.")
  ),
  last_name: pipe(
    string("Please enter Last Name."),
    minLength(1, "Please enter Last Name.")
  ),
  q1: pipe(boolean("Please enter correct details.")),
  q2: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q3: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  anx1: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  anx2: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  anx3: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  anx4: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  anx5: pipe(
    string("Please upload applicant signature."),
    minLength(1, "Please upload applicant signature.")
  ),
  q4: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q5: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q6: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q7: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  // q8: pipe(string("Please enter correct details."), minLength(1, "Please enter q8.")),
  q8: nullish(string("Please enter correct details."), "Please enter q8."),
  q9: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q10: optional(string("Please enter correct details.")),
  q11: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q12: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q13: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q14: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q15: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q16: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q17: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q18: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  applicants: array(NAApplicantSchema),
  surveys: array(NASurveySchema),
});

type NAForm = InferInput<typeof NASchema>;
export { NASchema, type NAForm };
