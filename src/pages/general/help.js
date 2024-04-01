import React from 'react'
import { Helmet } from 'react-helmet';
import HelpView from 'src/sections/settings/view/help-view';

export default function HelpPage() {
  return (
    <>
      <Helmet>
        <title>Help</title>
      </Helmet>

      <HelpView id />
    </>
  )
}



