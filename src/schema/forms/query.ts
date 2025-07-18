import {
  boolean,
  InferInput,
  minLength,
  object,
  optional,
  pipe,
  string,
} from "valibot";

const QuerySchema = object({
  query: pipe(
    string("Please enter your first name."),
    minLength(1, "Please enter your first name.")
  ),
  upload_url_1: optional(string("Please enter your contact number.")),
});

type QueryForm = InferInput<typeof QuerySchema>;
export { QuerySchema, type QueryForm };

const NotingSchema = object({
  query: pipe(
    string("Please enter your first name."),
    minLength(1, "Please enter your first name.")
  ),
  userid: pipe(
    string("Please select user."),
    minLength(1, "Please select user.")
  ),
  upload_url_1: optional(string("Please enter your contact number.")),
});

type NotingForm = InferInput<typeof NotingSchema>;
export { NotingSchema, type NotingForm };

const MarkToSchema = object({
  query: pipe(
    string("Please enter your first name."),
    minLength(1, "Please enter your first name.")
  ),
  userid: pipe(
    string("Please select user."),
    minLength(1, "Please select user.")
  ),
  request_type: pipe(
    string("Please request type."),
    minLength(1, "Please request type.")
  ),
  upload_url_1: optional(string("Please enter your contact number.")),
});

type MarkToForm = InferInput<typeof MarkToSchema>;
export { MarkToSchema, type MarkToForm };

const ReportSubmitSchema = object({
  query: pipe(string("Enter query."), minLength(1, "Enter query.")),
  all_report_submit: pipe(boolean("Please select if all report submitted.")),
  userid: pipe(
    string("Please select user."),
    minLength(1, "Please select user.")
  ),
  upload_url_1: optional(string("Please enter your contact number.")),
});

type ReportSubmitForm = InferInput<typeof ReportSubmitSchema>;
export { ReportSubmitSchema, type ReportSubmitForm };

const ScheduleHearingSchema = object({
  date: pipe(string("Please enter date."), minLength(1, "Please enter date.")),
  time: pipe(string("Please enter time."), minLength(1, "Please enter time.")),
});

type ScheduleHearingForm = InferInput<typeof ScheduleHearingSchema>;
export { ScheduleHearingSchema, type ScheduleHearingForm };
