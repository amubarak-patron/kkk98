import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
// routes
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {

  const mohLogo = (
    <>
      <Box
        ref={ref}
        component="div"
        sx={{
          width: "200px",
          height: "auto",
          ...sx,
        }}
        {...other}
      >
        <img
          src="/logo/moh-logo-full.png"
          alt="MoH Logo"
          style={{
            width: "auto",
            height: "100%",
          }}
        />
      </Box>
    </>
  );

  if (disabledLink) {
    return mohLogo;
  }

  return (
    <Link component={RouterLink} href="/dashboard" sx={{ display: "contents" }}>
      {mohLogo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
