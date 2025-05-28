import { isContainSpace } from "@/utils/methods";
import { check, InferInput, minLength, object, string, pipe } from "valibot";

const RegisterSchema = object({
  firstname: pipe(
    string(),
    minLength(1, "Please enter your first name."),
    check(isContainSpace, "First name cannot contain space.")
  ),
  lastname: pipe(
    string(),
    minLength(1, "Please enter your last name."),
    check(isContainSpace, "Last name cannot contain space.")
  ),
  mobile: pipe(
    string(),
    minLength(10, "Mobile number should be 10 digits."),
    check(isContainSpace, "Mobile number cannot contain space.")
  ),
  password: pipe(
    string(),
    minLength(1, "Please enter your password."),
    check(isContainSpace, "Password cannot contain space.")
  ),
});

type RegisterForm = InferInput<typeof RegisterSchema>;
export { RegisterSchema, type RegisterForm };
