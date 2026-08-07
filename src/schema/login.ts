import { isContainSpace } from "@/utils/methods";
import {
  check,
  InferInput,
  literal,
  minLength,
  object,
  optional,
  pipe,
  string,
  union,
} from "valibot";

const LoginSchema = object({
  mobile: pipe(
    string(),
    minLength(10, "Mobile number should be 10 digits."),
    check(isContainSpace, "Mobile number cannot contain space.")
  ),
  loginType: union([literal("PASSWORD"), literal("OTP")]),
  password: optional(
    pipe(string(), check(isContainSpace, "Password cannot contain space."))
  ),
  otp: optional(pipe(string(), check(isContainSpace, "OTP cannot contain space."))),
});

type LoginForm = InferInput<typeof LoginSchema>;
export { LoginSchema, type LoginForm };
