import { InferInput, minLength, object, optional, pipe, string } from "valibot";

const QuerySchema = object({
  query: pipe(
    string("Please enter your first name."),
    minLength(1, "Please enter your first name.")
  ),
  upload_url_1: optional(string("Please enter your contact number.")),
});

type QueryForm = InferInput<typeof QuerySchema>;
export { QuerySchema, type QueryForm };
