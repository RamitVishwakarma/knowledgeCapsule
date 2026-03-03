"use client";

import React, { memo, ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

import { cn } from "@/components/ui/utils";

import { FieldLabel } from "@/components/common/forms/field-label";
import { SelectOptions } from "@/lib/types";

// ─── Shared sub-components ───────────────────────────────────────────────────

interface SelectOptionItemProps {
  option: SelectOptions;
  valueLabel: string;
  itemLabel: string;
  currentValue: string | undefined;
  defaultValue: string | undefined;
}

const SelectOptionItem: React.FC<SelectOptionItemProps> = ({
  option,
  valueLabel,
  itemLabel,
  currentValue,
  defaultValue,
}) => {
  const valueValue = option[valueLabel as keyof SelectOptions];
  const itemValue = option[itemLabel as keyof SelectOptions];

  return (
    <SelectItem
      value={String(valueValue)}
      className={cn(
        "my-1 cursor-pointer rounded-md py-2",
        (currentValue?.toString() === String(valueValue) || defaultValue === String(valueValue)) &&
          "border-[0.5px]"
      )}
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-2 overflow-hidden">
        {String(itemValue)}
      </div>
    </SelectItem>
  );
};

/** Item shape for chip rendering in multi-select */
export interface SelectedItem {
  value: string;
  label: string;
  option?: SelectOptions;
}

// ─── Props ────────────────────────────────────────────────────────────────────

/**
 * Base props shared by both static and infinite modes
 */
interface BaseFormSelectProps {
  name: string;
  rules?: Record<string, unknown>;
  className?: string;
  triggerClassName?: string;
  label?: string;
  /** Key of the option object to use as the display label (default: "label") */
  itemLabel?: string;
  /** Key of the option object to use as the submitted value (default: "value") */
  valueLabel?: string;
  placeholder?: string;
  onSelectionChange?: (value: string | number, selectedOption?: SelectOptions) => void;
  description?: React.ReactNode;
  isAsterisk?: boolean;
  defaultValue?: string;
  showError?: boolean;
  /** When true, stores string[] in the form field and shows removable chips */
  multiSelect?: boolean;
  /** Max chips visible before showing +N more. Only applies when multiSelect=true (default: 2) */
  maxVisible?: number;
  /** Pre-loaded label+value pairs for IDs already in the form field (edit mode). Only for multiSelect */
  initialSelectedItems?: SelectedItem[];
  /** Custom chip renderer for multi-select. Receives item and onRemove callback */
  renderChip?: (item: SelectedItem, onRemove: () => void) => ReactNode;
}

/**
 * Props for static mode — pass a pre-loaded array of options
 */
interface StaticModeProps {
  mode?: "static";
  options: SelectOptions[];
  selectQuery?: never;
}

type FormSelectProps = BaseFormSelectProps & StaticModeProps;

/**
 * FormSelect — form-integrated select input with two modes and optional multi-select:
 *
 * **Static mode** (default): pass a pre-loaded `options` array.
 *
 * **Multi-select**: add `multiSelect` to either mode. Stores `string[]` in form field.
 * ```tsx
 * <FormSelect name="tagIds" mode="infinite" selectQuery={tagsQuery} multiSelect maxVisible={3} />
 * ```
 *
 * Must be rendered inside a shadcn `<Form>` wrapper (uses `useFormContext` internally).
 */
const FormSelect: React.FC<FormSelectProps> = memo((props) => {
  const { control } = useFormContext();

  // ── Static single-select mode ───────────────────────────────────────────────
  const {
    name,
    rules,
    className = "",
    triggerClassName = "",
    label = "",
    itemLabel = "label",
    valueLabel = "value",
    placeholder = "Select",
    onSelectionChange = () => {},
    description,
    isAsterisk = false,
    defaultValue,
    showError = true,
    options = [],
  } = props;

  const handleValueChange = (value: string | number) => {
    const selectedObject = options.find(
      (option) => String(option[valueLabel as keyof SelectOptions]) === String(value)
    );
    onSelectionChange(value, selectedObject);
  };

  return (
    <FormField
      control={control}
      rules={rules}
      name={name}
      render={({ field }) => {
        const { value, onChange } = field;

        const selectedOption = options.find(
          (opt) => String(opt[valueLabel as keyof SelectOptions]) === String(value)
        );
        const displayLabel = selectedOption
          ? String(selectedOption[itemLabel as keyof SelectOptions])
          : defaultValue
            ? String(
                options.find(
                  (opt) => String(opt[valueLabel as keyof SelectOptions]) === defaultValue
                )?.[itemLabel as keyof SelectOptions] ?? defaultValue
              )
            : null;

        return (
          <FormItem className="w-full min-w-0">
            {label && <FieldLabel label={label} isAsterisk={isAsterisk} />}
            <Select
              onValueChange={(e) => {
                onChange(e);
                handleValueChange(e);
              }}
              defaultValue={defaultValue}
              value={value}
            >
              <FormControl>
                <SelectTrigger
                  id={name}
                  className={cn(
                    "placeholder:text-muted-foreground h-9 w-full max-w-full overflow-hidden focus:ring-0 focus:ring-offset-0",
                    triggerClassName
                  )}
                >
                  {displayLabel ?? placeholder}
                </SelectTrigger>
              </FormControl>
              <SelectContent className={cn("z-60", className)}>
                {options.map((option) => (
                  <SelectOptionItem
                    key={String(option.value)}
                    option={option}
                    valueLabel={valueLabel}
                    itemLabel={itemLabel}
                    currentValue={value}
                    defaultValue={defaultValue}
                  />
                ))}
                {options.length === 0 && (
                  <p className="text-muted-foreground py-3 text-center text-sm">No options found</p>
                )}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            {showError && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
});

FormSelect.displayName = "FormSelect";

export default FormSelect;
