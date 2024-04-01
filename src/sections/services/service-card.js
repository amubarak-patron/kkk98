import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
import TextMaxLine from 'src/components/text-max-line';
// hooks
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function ServiceCard({ title, link, ...rest }) {
  const router = useRouter();


  const icon = (serviceCode) => (
    <img
      src={`/assets/icons/moh-icons/${serviceCode}.svg`}
      style={{
        width: 64,
        height: 64,
      }}
    />
  );

  return (
    <Box>
      <Box
        onClick={() => router.push(link)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: 1,
          borderColor: "grey.400",
          minHeight: 200,
          maxHeight: 210,
          transition: (t) => t.transitions.create('border-color'),
          '&:hover': {
            cursor: 'pointer',
            bgcolor: 'background.paper',
            borderColor: 'secondary.main',

          },
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            minHeight: 72,
            maxHeight: 72,
          }}
        >
          {icon(rest.service_code)}
        </Box>
        <TextMaxLine line={3} variant="h6" component="h3" align="center">
          {title}
        </TextMaxLine>
      </Box>
    </Box>
  );
}

ServiceCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
