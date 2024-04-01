import PropTypes from "prop-types";
// @mui
import { Box, Button, FormHelperText, Stack } from "@mui/material";
// hooks
import { useLocales } from "src/locales";
import { useGlobalDialogContext } from "../global-dialog";
// components
import Table from "../table/table";
import Iconify from "../iconify";
import EditObjectDialog from "./edit-object-dialog";
//

export default function ObjectEditorField({
  fields,
  value,
  onChange,
  error,
  helperText,
}) {
  const { t } = useLocales();
  const globalDialog = useGlobalDialogContext();

  const columns = [
    ...fields?.map((field) => ({
      id: field?.fieldVariable,
      label: t(field?.label),
      minWidth: 120,
    })),
  ];

  const onEdit = (row) => {
    globalDialog.onOpen({
      title: t("edit"),
      content: (
        <EditObjectDialog
          fields={fields}
          value={value}
          onChange={onChange}
          onClose={globalDialog.onClose}
          row={row}
        />
      ),
      dialogProps: {
        maxWidth: "md",
      },
    });
  };

  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: "divider",
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={1}>
        <Button
          onClick={onEdit}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Iconify icon="mdi:plus" />}
        >
          {t("edit")}
        </Button>
      </Stack>
      <Table
        tableContainerProps={{
          sx: {
            maxHeight: 500,
            overflow: "auto",
          },
        }}
        tableHeadProps={{
          // bold
          sx: {
            "& th": {
              fontWeight: "bold",
            },
          },
        }}
        columns={columns}
        rows={[value]}
      />

      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Box>
  );
}

ObjectEditorField.propTypes = {
  fields: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.object,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};
