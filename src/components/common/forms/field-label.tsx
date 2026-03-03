import { Label } from "@/components/ui/label";
import { cn } from "@/components/ui/utils";

interface FieldLabelProps {
  label: string;
  isAsterisk?: boolean;
  htmlFor?: string;
  className?: string;
}

export const FieldLabel = ({ label, isAsterisk, htmlFor, className }: FieldLabelProps) => {
  return (
    <Label htmlFor={htmlFor}>
      <div className="flex flex-row items-center">
        <p className={cn("text-base font-medium", className)}>
          {label} {isAsterisk && <span className="text-primary">*</span>}
        </p>
      </div>
    </Label>
  );
};
