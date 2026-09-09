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
  last_name: nullish(string("Please enter Last Name.")),
  q1: pipe(boolean("Please enter correct details.")),
  q2: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  q3: pipe(string("Please enter correct details."), minLength(1, "Please enter correct details.")),
  anx1: pipe(string("Please upload Annexure 1."), minLength(1, "Please upload Annexure 1.")),
  anx2: pipe(string("Please upload Annexure 2."), minLength(1, "Please upload Annexure 2.")),
  anx3: pipe(string("Please upload Annexure 3."), minLength(1, "Please upload Annexure 3.")),
  anx4: pipe(string("Please upload Annexure 4."), minLength(1, "Please upload Annexure 4.")),
  anx5: pipe(
    string("Please upload the applicant's signature."),
    minLength(1, "Please upload the applicant's signature.")
  ),
  q4: pipe(string("Please enter applicant's first name."), minLength(1, "Please enter applicant's first name.")),
  q5: pipe(string("Please enter full postal address."), minLength(1, "Please enter full postal address.")),
  q6: pipe(string("Please enter contact number."), minLength(1, "Please enter contact number.")),
  q7: pipe(string("Please enter survey number."), minLength(1, "Please enter survey number.")),
  // q8: pipe(string("Please enter correct details."), minLength(1, "Please enter q8.")),
  q8: nullish(string("Please enter sub-division.")),
  q9: pipe(string("Please enter area in Sq.mt."), minLength(1, "Please enter area in Sq.mt.")),
  q10: optional(string("Please enter old survey number.")),
  q11: pipe(string("Please enter area details."), minLength(1, "Please enter area details.")),
  q12: pipe(string("Please select type (Residential/Commercial/Industrial)."), minLength(1, "Please select type.")),
  q13: pipe(string("Please enter present land use details."), minLength(1, "Please enter present land use details.")),
  q14: pipe(string("Please enter electrical line details."), minLength(1, "Please enter electrical line details.")),
  q15: pipe(string("Please enter land acquisition details."), minLength(1, "Please enter land acquisition details.")),
  q16: pipe(string("Please enter road access details."), minLength(1, "Please enter road access details.")),
  q17: pipe(string("Please enter site access details."), minLength(1, "Please enter site access details.")),
  q18: pipe(string("Please enter past application details."), minLength(1, "Please enter past application details.")),
  applicants: array(NAApplicantSchema),
  surveys: array(NASurveySchema),
});

type NAForm = InferInput<typeof NASchema>;
export { NASchema, type NAForm };
