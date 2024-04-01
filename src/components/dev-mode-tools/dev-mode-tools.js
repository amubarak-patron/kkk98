import React from "react";
// @mui
import { Box, Button, Stack, Typography } from "@mui/material";
// locales
import { useLocales } from "src/locales";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
import { RouterLink } from "src/routes/components";
// components
import Iconify from "../iconify";

export default function DevModeTools() {
  const { t } = useLocales();
  const isOpen = useBoolean(false);
  return (
    <Box
      sx={{
        position: "fixed",
        left: "50%",
        bottom: 0,
        transform: "translateX(-50%)",
        zIndex: 9999,
      }}
    >
      {/* Toggle Button */}
      <Box
        onClick={isOpen.onToggle}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 0.5,
          py: 1,
          gap: 0.5,
          bgcolor: "background.neutral",
          border: (t) => `1px solid ${t.palette.divider}`,
          borderBottomWidth: 0,
          borderTopLeftRadius: (t) => t.shape.borderRadius,
          borderTopRightRadius: (t) => t.shape.borderRadius,
          transition: (t) => t.transitions.create("all"),
          "&:hover": {
            cursor: "pointer",
            bgcolor: "background.paper",
          },
        }}
      >
        <Iconify
          icon="material-symbols:code"
          width={18}
          height={18}
          color="secondary.darker"
        />
        <Typography
          variant="caption"
          fontWeight="fontWeightBold"
          color="secondary.darker"
        >
          {t("dev_tools")}
        </Typography>
      </Box>

      {/* Dev Tools */}
      <Box
        sx={{
          maxHeight: isOpen.value ? "100px" : "0px",
          bgcolor: "background.paper",
          border: (t) => `1px solid ${t.palette.divider}`,
          overflow: "hidden",
          transition: (t) => t.transitions.create("all"),
        }}
      >
        <Stack direction="row" spacing={1} p={2}>
          <Button
            variant="outlined"
            size="small"
            LinkComponent={RouterLink}
            to="/generate-form"
            onClick={isOpen.onFalse}
          >
            {t("generate_form")}
          </Button>
          <Button
            variant="outlined"
            size="small"
            LinkComponent={RouterLink}
            to="/playground"
            onClick={isOpen.onFalse}
          >
            {t("playground")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
