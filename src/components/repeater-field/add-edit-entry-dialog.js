import React from "react";
import PropTypes from "prop-types";
// @mui
import { Box } from "@mui/material";
// hooks
import { useLocales } from "src/locales";
// components
import DynamicForm, { getForm } from "../dynamic-form";
import _ from "lodash";
import shortid from "shortid";

export default function AddEditEntryDialog({
  fields,
  value,
  onChange,
  onAddEntry,
  onEditEntry,
  onAddEditEntry,
  row,
  isEdit,
  onClose,
  submitButtonProps,
}) {
  const { t } = useLocales();

  const form = getForm(fields);

  const defaultValues = {
    ...form.defaultValues,
    ...row,
  };

  const handleSubmit = (data) => {
    const createNewValue = (newData) => {
      return isEdit
        ? value.map((item) => (item === row ? newData : item))
        : [...value, { ...newData, uniqueRepeaterId: shortid.generate() }];
    }

    if (!isEdit) {
      // Add Case
      if (onAddEditEntry) {
        return onAddEditEntry(data, (newData) => {
          onChange(createNewValue(newData || data))
          if (onClose) onClose();
        })
      } else if (onAddEntry) {
        return onAddEditEntry(data, (newData) => {
          onChange(createNewValue(newData || data))
          if (onClose) onClose();
        })
      }
    } else {
      // Edit Case
      if (onAddEditEntry) {
        return onAddEditEntry(data, (newData) => {
          onChange(createNewValue(newData || data))
          if (onClose) onClose();
        })
      } else if (onAddEntry) {
        return onEditEntry(data, (newData) => {
          onChange(createNewValue(newData || data))
          if (onClose) onClose();
        })
      }
    }

    onChange(createNewValue(data));

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
        {/* <DynamicForm
          {...form}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitButtonProps={{
            ...submitButtonProps,
            ...(submitButtonProps?.label && {
              label: t(submitButtonProps?.label)
            }),
            ...(isEdit && {
              label: t("edit"),
            }),
          }}
        /> */}
      </Box>
    </>
  );
}

AddEditEntryDialog.propTypes = {
  fields: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onAddEntry: PropTypes.func,
  onEditEntry: PropTypes.func,
  onAddEditEntry: PropTypes.func,
  row: PropTypes.object,
  isEdit: PropTypes.bool,
};
