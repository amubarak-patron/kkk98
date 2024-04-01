import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fToNow } from 'src/utils/format-time';
// hooks
import { useLocales } from 'src/locales';
// components
import FileThumbnail from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

export default function NotificationItem({ notification }) {
  const { t } = useLocales();

  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" color="text.primary" noWrap>
              {notification.subTitle}
            </Typography>
            <Typography variant="caption" color="secondary.main">
              {fToNow(notification.createdAt)}
            </Typography>
          </Box>
        </>
      }
      secondary={
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight="fontWeightBold" color="text.primary" noWrap>
              {notification.title}
            </Typography>
            <Box
              sx={{
                borderRadius: '50%',
                bgcolor: 'primary.main',
                position: 'absolute',
              }}
            />
          </Box>
          {reader(notification.content)}
        </>
      }
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Accept
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );

  const changePasswordAction = (
    <Stack
      alignItems="flex-end"
      sx={{
        mt: 1.5,
      }}
    >
      <Button size="small" variant="contained" color="secondary">
        {t('change_password')}
      </Button>
    </Stack>
  );

  const investigationAction = (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      <Avatar src="" />

      <Stack
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        flexGrow={1}
        sx={{ minWidth: 0 }}
      >
        <ListItemText
          disableTypography
          primary={
            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }} noWrap>
              اسم المستخدم
            </Typography>
          }
        />

        <Button size="small" variant="contained" color="secondary">
          {t('view')}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {notification.type === 'change_password' && changePasswordAction}
        {notification.type === 'investigation' && investigationAction}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        color: 'text.secondary',
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
