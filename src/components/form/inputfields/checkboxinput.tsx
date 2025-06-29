import { Checkbox, Input } from "antd";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type CheckBoxInputProps<T extends FieldValues> = {
  name: Path<T>;
  title?: string;
  required?: boolean;
  disable?: boolean;
  extratax?: string;
};

export function CheckBoxInput<T extends FieldValues>(
  props: CheckBoxInputProps<T>
) {
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
          {props.title && (
            <div className="w-full flex flex-wrap">
              <label htmlFor={props.name} className="text-sm font-normal">
                {props.title}
                {props.required && <span className="text-rose-500">*</span>}
              </label>
              {props.extratax && (
                <p className="text-red-500 text-sm">{props.extratax}</p>
              )}
            </div>
          )}

          <Checkbox
            className="w-full mt-2"
            checked={field.value}
            disabled={props.disable ?? false}
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
          />

          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
