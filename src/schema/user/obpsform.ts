import {
  InferInput,
  minLength,
  object,
  string,
  pipe,
  number,
  minValue,
  boolean,
  optional,
  nullish,
} from "valibot";

const ObpsSchema = object({
  villageId: pipe(
    number("Please select your village."),
    minValue(1, "Please select your village.")
  ),
  last_name: pipe(
    string("Please enter Last Name."),
    minLength(1, "Please enter Last Name.")
  ),
  anx1: pipe(string("Please enter anx1."), minLength(1, "Please enter anx1.")),
  anx2: pipe(string("Please enter anx2."), minLength(1, "Please enter anx2.")),
  anx3: pipe(string("Please enter anx3."), minLength(1, "Please enter anx3.")),
  anx4: pipe(string("Please enter anx4."), minLength(1, "Please enter anx4.")),
  anx5: optional(string("Please enter anx5.")),
  q4: pipe(string("Please enter q4."), minLength(1, "Please enter q4.")),
  q5: pipe(string("Please enter q5."), minLength(1, "Please enter q5.")),
  q6: pipe(string("Please enter q6."), minLength(1, "Please enter q6.")),
  q7: pipe(string("Please enter q7."), minLength(1, "Please enter q7.")),
  q8: nullish(string("Please enter q8."), "Please enter q8."),
  q9: pipe(string("Please enter q9."), minLength(1, "Please enter q9.")),
  q10: pipe(string("Please enter q10."), minLength(1, "Please enter q10.")),
  q11: pipe(string("Please enter q11."), minLength(1, "Please enter q11.")),
  q12: pipe(string("Please enter q12."), minLength(1, "Please enter q12.")),
});

type ObpsForm = InferInput<typeof ObpsSchema>;
export { ObpsSchema, type ObpsForm };
