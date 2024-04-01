import { IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SvgColor from 'src/components/svg-color'
import { varHover } from 'src/components/animate';
import { Navigate, useNavigate } from 'react-router';

import { useLocales } from "src/locales";
import { useRouter } from 'src/routes/hooks';
function HelpButton() {
  const { currentLang } = useLocales();
  const { t } = useLocales();
  const router = useRouter();
  const serviceCode = (window.location.pathname.split('/').pop())
  console.log("serviceCode", serviceCode)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IconButton
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={() => router.push(`/help/${serviceCode}`)}

        sx={currentLang?.value === "ar" ?
          {
            color: "primary.main"
          } :
          {
            color: "primary.main",
            transform: 'scale(-1,1)'
          }

        }
      >
        <SvgColor src="/assets/icons/designer/navbar/help.svg" />
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {t('help')}
      </Typography>
    </div>
  )
}

export default HelpButton
