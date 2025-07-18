import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { SimpleTextEditor } from "../../editors/simpletexteditor/page";
import { Dispatch, SetStateAction } from "react";

type SimpleTextEditorInputProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  placeholder: string;
  required: boolean;
  setQueryData: Dispatch<SetStateAction<string>>;
};

export function SimpleTextEditorInput<T extends FieldValues>(
  props: SimpleTextEditorInputProps<T>
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[props.name as keyof typeof errors];

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
        <>
          <label
            htmlFor={props.name}
            className="text-sm font-normal block mb-1"
          >
            {props.title}
            {props.required && <span className="text-rose-500">*</span>}
          </label>
          <div className={`${error ? "border-red-500" : ""}`}>
            <SimpleTextEditor
              placeholder={props.placeholder}
              onChange={(value: string) => field.onChange(value)}
              initialValue={field.value || ""}
              setQueryData={props.setQueryData}
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error.message?.toString()}
            </p>
          )}
        </>
      )}
    />
  );
}
