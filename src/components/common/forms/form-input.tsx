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
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

interface FormInputProps {
  name: string;
  type?: string;
  label?: string;
  itemLabel?: string;
  placeholder?: string;
  info?: string;
  onInputChange?: (value: string | number | undefined) => void;
  description?: React.ReactNode | string;
  isAsterisk?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  showError?: boolean;
  [key: string]: unknown;
}

const FormInput: React.FC<FormInputProps> = memo(
  ({
    name,
    type = "text",
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
        render={({ field, fieldState: { error, invalid } }) => {
          const { value, onChange } = field;

          return (
            <FormItem aria-disabled={disabled} className={`w-full ${containerClassName}`}>
              {label && <FieldLabel label={label} isAsterisk={isAsterisk} />}
              <FormControl>
                <div className="relative">
                  <Input
                    type={type}
                    placeholder={placeholder}
                    id={name}
                    {...field}
                    {...rest}
                    value={value ?? ""}
                    onChange={(e) => {
                      const nextValue =
                        type === "number"
                          ? e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                          : e.target.value;
                      onChange(nextValue);
                      onInputChange(nextValue);
                    }}
                    disabled={disabled}
                    className={cn(
                      "h-9 bg-white tracking-wider placeholder:text-neutral-600",
                      invalid &&
                        "border-danger-500 ring-danger-500 focus:border-danger-500 focus:ring-danger-500",
                      className
                    )}
                  />
                </div>
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              {showError && (
                <>
                  {error && (
                    <div className="flex items-center gap-x-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <FormMessage />
                    </div>
                  )}
                </>
              )}
            </FormItem>
          );
        }}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
