import {
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
