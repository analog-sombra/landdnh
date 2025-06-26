import { Input } from "antd";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type HiddenInputProps<T extends FieldValues> = {
  name: Path<T>;
  value: string;
};

export function HiddenInput<T extends FieldValues>(props: HiddenInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Get the error for this specific field
  const error = errors[props.name as keyof typeof errors];
  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
        <>
          <Input
            type="hidden"
            className="w-full mt-2"
            value={props.value !== undefined ? props.value : field.value}
            onChange={field.onChange}
          />
          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
