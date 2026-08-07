import { FormProvider, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { onFormError } from "@/utils/methods";
import { TextInput } from "../inputfields/textinput";
import { PasswordInput } from "../inputfields/passwordinput";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiCall } from "@/services/api";
import { LoginForm, LoginSchema } from "@/schema/login";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const methods = useForm<LoginForm>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      loginType: "PASSWORD",
      mobile: "",
      password: "",
      otp: "",
    },
  });
  const loginType = methods.watch("loginType");
  const [isOtpSent, setIsOtpSent] = useState(false);

  type SignInResponse = {
    id: string;
    role: string;
  };

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginForm) => {
      const response = await ApiCall({
        query:
          "query LoginUser($loginAuthInput: LoginAuthInput!) {loginUser(loginAuthInput: $loginAuthInput) { role, id }}",
        variables: {
          loginAuthInput: {
            contact: data.mobile,
            loginType: data.loginType,
            password: data.loginType === "PASSWORD" ? data.password : undefined,
            otp: data.loginType === "OTP" ? data.otp : undefined,
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["loginUser"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "loginUser"
      ] as SignInResponse;
    },

    onSuccess: (data) => {
      setCookie("role", data.role);
      setCookie("id", data.id);
      if (data.role == "USER") {
        router.push("/dashboard/user/na-permission");
      } else {
        router.push("/dashboard/department/na-permission");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: LoginForm) => {
    methods.clearErrors();

    if (data.loginType === "PASSWORD" && (!data.password || data.password.length < 1)) {
      methods.setError("password", {
        type: "manual",
        message: "Please enter your password.",
      });
      return;
    }

    if (data.loginType === "OTP" && !isOtpSent) {
      if (!data.mobile || data.mobile.length < 10) {
        methods.setError("mobile", {
          type: "manual",
          message: "Please enter valid mobile number.",
        });
        return;
      }

      setIsOtpSent(true);
      toast.success("OTP sent successfully");
      return;
    }

    if (data.loginType === "OTP" && (!data.otp || data.otp.length < 1)) {
      methods.setError("otp", {
        type: "manual",
        message: "Please enter OTP.",
      });
      return;
    }

    login.mutate({
      mobile: data.mobile,
      loginType: data.loginType,
      password: data.password,
      otp: data.otp,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onFormError)}>
        <div className="mt-2">
          <p className="text-sm font-normal">Login Method</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm ${
                loginType === "PASSWORD"
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 bg-white text-gray-600"
              }`}
              onClick={() => {
                methods.setValue("loginType", "PASSWORD");
                methods.setValue("otp", "");
                methods.clearErrors("otp");
                setIsOtpSent(false);
              }}
            >
              Password
            </button>

            <button
              type="button"
              className={`rounded-md border px-3 py-2 text-sm ${
                loginType === "OTP"
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 bg-white text-gray-600"
              }`}
              onClick={() => {
                methods.setValue("loginType", "OTP");
                methods.setValue("password", "");
                methods.clearErrors("password");
                methods.clearErrors("mobile");
                setIsOtpSent(false);
              }}
            >
              OTP
            </button>
          </div>
        </div>

        <div className="mt-2">
          <TextInput<LoginForm>
            title="Mobile Number"
            maxlength={10}
            required={true}
            name="mobile"
            placeholder="Enter mobile number"
          />
        </div>

        {loginType === "PASSWORD" ? (
          <div className="mt-2">
            <PasswordInput<LoginForm>
              title="Password"
              required={true}
              name="password"
              placeholder="Enter Password"
            />
          </div>
        ) : isOtpSent ? (
          <div className="mt-2">
            <TextInput<LoginForm>
              title="OTP"
              required={true}
              name="otp"
              onlynumber={true}
              maxlength={6}
              placeholder="Enter OTP"
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white mt-2 cursor-pointer w-full"
        >
          {login.isPending
            ? "Loading..."
            : loginType === "OTP"
            ? isOtpSent
              ? "Verify"
              : "Send OTP"
            : "Login"}
        </button>
      </form>
    </FormProvider>
  );
};

export default LoginPage;
