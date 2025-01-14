import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { MuiOtpInput } from "mui-one-time-password-input";
// @mui
import FormHelperText from "@mui/material/FormHelperText";

// ----------------------------------------------------------------------

export default function RHFOTPField({ name, otpLength, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div dir="ltr">
          <MuiOtpInput
            {...field}
            autoFocus
            gap={1.5}
            length={otpLength || 4}

            TextFieldsProps={{
              error: !!error,
              placeholder: "-",
            }}
            {...other}
          />

          {error && (
            <FormHelperText sx={{ px: 2 }} error>
              {error.message}
            </FormHelperText>
          )}

        </div>
      )}
    />
  );
}

RHFOTPField.propTypes = {
  name: PropTypes.string,
};
