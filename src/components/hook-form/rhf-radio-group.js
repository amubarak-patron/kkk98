import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import _ from "lodash";
import { useRequest } from "alova";
// @mui
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
// locales
import { useLocales } from "src/locales";
// api
import { optionsFromAPISourceGetter } from "src/utils/api";
// components
import { CircularProgress } from "@mui/material";

// ----------------------------------------------------------------------

export default function RHFRadioGroup({
  name,
  row,
  label,
  isAffectedByOtherFields,
  affectingFields,
  optionsSourceType,
  optionsSourceApi,
  optionsSourceApiToken,
  optionsSourceApiValueKey,
  optionsSourceApiLabelKey,
  excludedValues = [],
  options: manualOptions,
  getOptionLabel,
  getOptionValue,
  spacing,
  helperText,
  ...other
}) {
  const renderCount = useRef(0)
  const { t } = useLocales();
  const {
    loading,
    send,
    data: options,
    update
  } = useRequest(
    (params) =>
      optionsFromAPISourceGetter(
        optionsSourceApi,
        "",
        params,
        optionsSourceApiLabelKey,
        optionsSourceApiValueKey,
        "appendUrl"
      ),
    {
      immediate: false,
      initialData: manualOptions || [],
    }
  );

  const { control, getValues, setValue } = useFormContext();

  const labelledby = label ? `${name}-${label}` : "";

  const valuesOfAffectingFields = affectingFields?.map((field) =>
    getValues(field.fieldName)
  );

  // ** Functions
  const handleGetOptionLabel = (option) => {
    if (getOptionLabel) {
      return getOptionLabel(option);
    }
    return option.label;
  };

  const handleGetOptionValue = (option) => {
    if (getOptionValue) {
      return getOptionValue(option);
    }
    return option.value;
  };

  useEffect(() => {
    renderCount.current += 1;
    if (optionsSourceType === "api") {
      const fetchOptions = async () => {
        let params = {};
        // if affectingFields is not null, then we need to get the value of the affectingFields field
        // and append it to the url
        if (affectingFields) {
          // if one of the affectingFields fields is empty, then we don't need to fetch the options
          // so we just return
          if (affectingFields.some((field) => !getValues(field.fieldName))) {
            return;
          }

          affectingFields.forEach((field) => {
            const { fieldName } = field;
            const value = getValues(fieldName);
            params[fieldName + "_id"] = value;
          });
        }

        send(params).then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setValue(`${name}_hasOptions`, true)
          } else {
            setValue(`${name}_hasOptions`, false)
          }
        })
      };

      fetchOptions();
    }

    // when the value of one affectingFields field changes, we need to reset the value of the current field
    // only after second render, because first and second render are use to setup fields
    // third render is for user interactions
    if (isAffectedByOtherFields && renderCount.current > 2) {
      setValue(name, "");
      setValue(name + '_label', "")
      setValue(`${name}_hasOptions`, false)
      update({
        data: []
      })
    }

  }, [
    // whenever the value of affectingFields changes, we need to fetch the options again
    // so we add affectingFields to the dependency array
    _.join(valuesOfAffectingFields, ","),
  ]);

  useEffect(() => {
    if (getValues(name) && options.length > 0) {
      const selectedOption = options.find(item => handleGetOptionValue(item) === getValues(name))
      setValue(`${name}_label`, handleGetOptionLabel(selectedOption))
    }
  }, [getValues(name), options])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset">
          {label && (
            <FormLabel
              component="legend"
              id={labelledby}
              sx={{ typography: "body2" }}
            >
              {label}
            </FormLabel>
          )}

          <RadioGroup
            {...field}
            aria-labelledby={labelledby}
            row={row}
            {...other}
          >
            {loading && <CircularProgress size={24} />}
            {!loading &&
              options
                .filter(item =>
                  !excludedValues.includes(
                    getOptionValue(item)
                  )
                ).map((option, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={handleGetOptionValue(option)}
                      control={<Radio />}
                      label={handleGetOptionLabel(option)}
                      disabled={loading}
                      sx={{
                        "&:not(:last-of-type)": {
                          mb: spacing || 0,
                        },
                        ...(row && {
                          mr: 0,
                          "&:not(:last-of-type)": {
                            mr: spacing || 2,
                          },
                        }),
                      }}
                    />
                  );
                })}
          </RadioGroup>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 0 }}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

RHFRadioGroup.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  optionsSourceType: PropTypes.oneOf(["manual", "api"]),
  optionsSourceApi: PropTypes.string,
  optionsSourceApiToken: PropTypes.string,
  optionsSourceApiValueKey: PropTypes.string,
  optionsSourceApiLabelKey: PropTypes.string,
  excludedValues: PropTypes.array,
  options: PropTypes.array,
  row: PropTypes.bool,
  spacing: PropTypes.number,
};
