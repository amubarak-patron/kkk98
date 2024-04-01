import React from "react";
import PropTypes from "prop-types";
// @mui
import { Box } from "@mui/material";
// hooks
import { useLocales } from "src/locales";
// components
import DynamicForm, { getForm } from "../dynamic-form";

export default function EditObjectDialog({
  fields,
  value,
  onChange,
  onClose,
}) {
  const { t } = useLocales();

  const form = getForm(fields);

  const defaultValues = {
    ...form.defaultValues,
    ...value,
  };

  const handleSubmit = (data) => {
    // Value is Object
    const newValue = {
      ...value,
      ...data,
    };

    onChange(newValue);

    if (onClose) onClose();
  };

  return (
    <>
      <Box
        sx={{
          py: 2,
          px: 3,
        }}
      >
        <DynamicForm
          {...form}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitButtonProps={{
            label: t("edit"),
          }}
        />
      </Box>
    </>
  );
}

EditObjectDialog.propTypes = {
  fields: PropTypes.array,
  value: PropTypes.object,
  onChange: PropTypes.func,
  row: PropTypes.object,
};
