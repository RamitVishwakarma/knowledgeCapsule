"use client";

import React, { memo } from "react";
import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface FormCheckboxProps {
  name: string;
  label?: string;
  description?: React.ReactNode | string;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
  showPrimaryBadge?: boolean; // only for agent select
  [key: string]: unknown;
}

const FormCheckbox: React.FC<FormCheckboxProps> = memo(
  ({
    name,
    label,
    description,
    disabled = false,
    containerClassName = "",
    className = "",
    showPrimaryBadge = false,
    ...rest
  }) => {
    const { control } = useFormContext();
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <FormItem
            className={`flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm ${containerClassName}`}
            aria-disabled={disabled}
          >
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                }}
                disabled={disabled}
                className={className}
                {...rest}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <div className="flex items-center gap-2">
                {label && <FormLabel>{label}</FormLabel>}
                {showPrimaryBadge && (
                  <Badge
                    variant="default"
                    className="text-info bg-info/10 hover:bg-info/15 text-xs"
                  >
                    Primary
                  </Badge>
                )}
              </div>
              {description && <FormDescription>{description}</FormDescription>}
              {error && <FormMessage>{error.message}</FormMessage>}
            </div>
          </FormItem>
        )}
      />
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
