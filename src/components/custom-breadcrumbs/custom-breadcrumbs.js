import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
//
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import LinkItem from './link-item';

// ----------------------------------------------------------------------

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  backLink,
  sx,
  ...other
}) {
  const lastLink = links[links.length - 1]?.name;

  return (
    <Box sx={{ ...sx }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="start" spacing={3} sx={{ flexGrow: 1 }}>
          {backLink && (
            <IconButton component={RouterLink} href={backLink}>
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>
          )}
          <Box>
            {/* HEADING */}
            {heading && (
              <Typography variant="h4" gutterBottom>
                {heading}
              </Typography>
            )}

            {/* BREADCRUMBS */}
            {!!links.length && (
              <Breadcrumbs separator={<Separator />} {...other}>
                {links.map((link) => (
                  <LinkItem
                    key={link.name || ''}
                    link={link}
                    activeLast={activeLast}
                    disabled={link.name === lastLink}
                  />
                ))}
              </Breadcrumbs>
            )}
          </Box>
        </Stack>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

CustomBreadcrumbs.propTypes = {
  sx: PropTypes.object,
  action: PropTypes.node,
  links: PropTypes.array,
  heading: PropTypes.string,
  moreLink: PropTypes.array,
  activeLast: PropTypes.bool,
  backLink: PropTypes.string,
};

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
