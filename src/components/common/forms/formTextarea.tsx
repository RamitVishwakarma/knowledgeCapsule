"use client";

import { AlertCircle } from "lucide-react";
import React, { memo } from "react";
import { useFormContext } from "react-hook-form";

import { FieldLabel } from "@/components/common/forms/field-label";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  info?: string;
  onInputChange?: (value: string) => void;
  description?: React.ReactNode | string;
  isAsterisk?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  showError?: boolean;
  [key: string]: unknown;
}

const FormTextArea: React.FC<FormTextAreaProps> = memo(
  ({
    name,
    label = "",
    placeholder = "",
    onInputChange = () => {},
    description,
    isAsterisk = false,
    className = "",
    containerClassName = "",
    disabled = false,
    showError = true,
    ...rest
  }) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => {
          const { onChange } = field;
          return (
            <FormItem aria-disabled={disabled} className={`w-full ${containerClassName}`}>
              {label && (
                <div className="flex flex-row items-center">
                  <FieldLabel label={label} isAsterisk={isAsterisk} />
                </div>
              )}
              <FormControl>
                <Textarea
                  id={name}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`${className} placeholder:text-gray-light resize-none tracking-wider`}
                  {...field}
                  {...rest}
                  // Allow for any external onInputChange callbacks
                  onChange={(e) => {
                    onChange(e);
                    onInputChange(e.target.value);
                  }}
                />
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              {showError && error && (
                <div className="flex items-center gap-x-1">
                  <AlertCircle className="text-destructive size-4" />
                  <FormMessage />
                </div>
              )}
            </FormItem>
          );
        }}
      />
    );
  }
);

FormTextArea.displayName = "FormTextArea";

export default FormTextArea;
