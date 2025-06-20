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

const LoginPage = () => {
  const router = useRouter();
  const methods = useForm<LoginForm>({
    resolver: valibotResolver(LoginSchema),
  });

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
            password: data.password,
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
        router.push("/dashboard/user/services");
      } else {
        router.push("/dashboard/department/na-permission");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: LoginForm) => {
    login.mutate({
      mobile: data.mobile,
      password: data.password,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onFormError)}>
        <div className="mt-2">
          <TextInput<LoginForm>
            title="Mobile Number"
            required={true}
            name="mobile"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="mt-2">
          <PasswordInput<LoginForm>
            title="Password"
            required={true}
            name="password"
            placeholder="Enter Password"
          />
        </div>

        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white mt-2 cursor-pointer w-full"
        >
          {login.isPending ? "Loading..." : "Login"}
        </button>
      </form>
    </FormProvider>
  );
};

export default LoginPage;
