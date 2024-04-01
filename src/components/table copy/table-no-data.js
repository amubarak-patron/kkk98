import PropTypes from "prop-types";
// @mui
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// locales
import { useLocales } from "src/locales";
//
import EmptyContent from "../empty-content";

// ----------------------------------------------------------------------

export default function TableNoData({ notFound, sx, text }) {
  const { t } = useLocales();
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            hideImg
            title={text || t("no_data")}
            sx={{
              py: 1,
              ...sx,
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}

TableNoData.propTypes = {
  notFound: PropTypes.bool,
  sx: PropTypes.object,
  text: PropTypes.string,
};