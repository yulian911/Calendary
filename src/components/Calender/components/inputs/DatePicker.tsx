import DateProvider from "../hoc/DateProvider";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";

interface EditorDatePickerProps {
  type: "date" | "datetime";
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  modalVariant?: "dialog" | "inline" | "static";
  value: Date | string;
  name: string;
  onChange(name: string, date: Date): void;
  error?: boolean;
  errMsg?: string;
}

const EditorDatePicker = ({
  type,
  value,
  label,
  name,
  onChange,
  variant,
  modalVariant,
  error,
  errMsg,
}: EditorDatePickerProps) => {
  const Picker = type === "date" ? DatePicker : DateTimePicker;

  return (
    <DateProvider>

      <Picker
        value={value}
        label={label}
        onChange={(e:any) => onChange(name, new Date(e || ""))}
        // variant={modalVariant}
        minutesStep={5}
        renderInput={(params:any) => (
          <TextField
            variant={variant}
            helperText={error ? errMsg : ""}
            error={error}
            style={{ width: "100%" }}
            {...params}
          />
        )}
      />
    </DateProvider>
  );
};

EditorDatePicker.defaultProps = {
  type: "datetime",
  variant: "outlined",
  modalVariant: "inline",
};
export { EditorDatePicker };
