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
import { RegisterForm, RegisterSchema } from "@/schema/register";

const RegisterPage = () => {
  const router = useRouter();
  const methods = useForm<RegisterForm>({
    resolver: valibotResolver(RegisterSchema),
  });

  type SignInResponse = {
    id: string;
    role: string;
  };

  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterForm) => {
      const response = await ApiCall({
        query:
          "mutation RegisterUser($createAuthInput: CreateAuthInput!) { registerUser(createAuthInput: $createAuthInput) { id, role }}",
        variables: {
          createAuthInput: {
            firstName: data.firstname,
            lastName: data.lastname,
            contact: data.mobile,
            password: data.password,
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["registerUser"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "registerUser"
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

  const onSubmit = async (data: RegisterForm) => {
    register.mutate({
      firstname: data.firstname,
      lastname: data.lastname,
      mobile: data.mobile,
      password: data.password,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onFormError)}>
        <div className="mt-2">
          <TextInput<RegisterForm>
            title="Frist Name"
            required={true}
            name="firstname"
            placeholder="Enter first name"
          />
        </div>
        <div className="mt-2">
          <TextInput<RegisterForm>
            title="Last Name"
            required={true}
            name="lastname"
            placeholder="Enter last name"
          />
        </div>
        <div className="mt-2">
          <TextInput<RegisterForm>
            title="Mobile Number"
            required={true}
            name="mobile"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="mt-2">
          <PasswordInput<RegisterForm>
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
          {register.isPending ? "Loading..." : "Register"}
        </button>
      </form>
    </FormProvider>
  );
};

export default RegisterPage;
