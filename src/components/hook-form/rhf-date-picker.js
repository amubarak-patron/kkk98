import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { DatePicker } from "@mui/x-date-pickers";
import { FormHelperText, TextField } from "@mui/material";

// ----------------------------------------------------------------------

export default function RHFDatePicker({
  name,
  error,
  helperText,
  type,
  sx,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <DatePicker
            {...field}
            views={["year", "month", "day"]}
            format={other.format || "yyyy/MM/dd"}
            minDate={other.minDate ? new Date(other.minDate) : null}
            maxDate={other.maxDate ? new Date(other.maxDate) : null}
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              field.onChange(date);
            }}
            fullWidth
            helperText={error ? error?.message : helperText}
            sx={{
              ...sx,
              ...(error && {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) =>
                    `${theme.palette.error.main} !important`,
                },
              }),
            }}
            slotProps={{ textField: { placeholder: other.placeholder } }}
            {...other}
          />
          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}

RHFDatePicker.propTypes = {
  helperText: PropTypes.string,
  error: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
  sx: PropTypes.object,
};