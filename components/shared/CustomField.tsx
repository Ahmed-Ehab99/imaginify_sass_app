import React from "react";
import { Control, ControllerRenderProps, Path } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { formSchema } from "./TransformationForm";

type FormValues = z.infer<typeof formSchema>;

type CustomFieldProps = {
  control: Control<FormValues> | undefined;
  name: Path<FormValues>;
  render: (props: {
    field: ControllerRenderProps<FormValues, Path<FormValues>>;
  }) => React.ReactNode;
  formLabel?: string;
  className?: string;
};

export const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
