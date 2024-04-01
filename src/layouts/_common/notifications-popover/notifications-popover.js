import { useState, useCallback } from 'react';
import shortid from 'shortid';
// @mui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { varHover } from 'src/components/animate';
import SvgColor from 'src/components/svg-color/svg-color';
//
import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

const createNotification = (type, isUnRead, createdAt, title, subTitle, content) => {
  const id = shortid.generate();
  return {
    id,
    type,
    isUnRead,
    createdAt,
    title,
    subTitle,
    content,
  };
};
const INVESTIGATION_NOTIFICATION = {
  type: 'investigation',
  subTitle: 'تحقيق',
  title: 'تحقيق جديد',
  content: 'تم اضافة تحقيق جديد',
};
const CHANGE_PASSWORD_NOTIFICATION = {
  type: 'change_password',
  subTitle: 'كلمة المرور',
  title: 'تغيير كلمة المرور',
  content: 'يجب عليك تغيير كلمة المرور',
};

const NOTIFICATIONS = Array.from({ length: 9 }).map((_, index) => {
  const isUnRead = index % 2 === 0;
  const createdAt = new Date();
  // assign notification randomly
  const notificationsTypes = [INVESTIGATION_NOTIFICATION, CHANGE_PASSWORD_NOTIFICATION];
  const notification = notificationsTypes[Math.floor(Math.random() * notificationsTypes.length)];
  return createNotification(
    notification.type,
    isUnRead,
    createdAt,
    notification.title,
    notification.subTitle,
    notification.content
  );
});

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const { t } = useLocales();

  const smUp = useResponsive('up', 'sm');

  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('notifications')}
      </Typography>

      {!!totalUnRead && (
        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {t('unread_num', { num: totalUnRead })}
        </Typography>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        // component={m.button}
        // whileTap="tap"
        // whileHover="hover"
        // variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge
          variant="dot"
          color="error"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'background.paper',
            },
          }}
        >
          <SvgColor src="/assets/icons/designer/bell.svg" color="grey.800" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}
        <Divider />
        {renderList}
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            {t('view_all')}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
