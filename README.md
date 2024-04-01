# JIACC Frontend - Investigation System

<img width="350px" src="https://img1.wsimg.com/isteam/ip/33f4fe89-d74f-4681-96f0-6d1181d78132/blob.png/:/rs=w:245,h:75,cg:true,m/cr=w:245,h:75/qt=q:95" />
<img width="350px" src="https://www.jiacc.gov.jo/ebv4.0/root_storage/ar/eb_homepage/logo2020.png" />

### Prepared By: Ahmad Mubarak

## Table of Contents

1.  [Task List](#Tasks)

2.  [Introduction](#introduction)

3.  [Node Version](#node-version)

4.  [Scripts](#scripts)

5.  [Installation and Running](#installation-and-running)

6.  [Dependencies](#dependencies)

7.  [MUI (Material User Interface)](#mui-material-user-interface)

8.  [Folder Structure](#folder-structure)

9.  [Theme](#theme)

10. [Layouts](#layouts)

11. [Routing and Paths](#routing-and-paths)

12. [i18n (Internationalization)](#i18n-internationalization)

13. [a11y (Accessibility)](#a11y-accessibility)

14. [Authentication](#authentication)

15. [Onboarding Tour](#onboarding-tour)

## Task List

- [x] Initialize project

- [x] Setup theme and customize color presets

- [x] Implement all screens from Figma design

- [x] Create dialogs / pop-ups / pop-overs / drawers from Figma design

- [x] Create components from Figma design

- [x] Import and Implement Icons and Assets from Figma design

- [x] Write & Develop Hooks / Contexts

- [ ] Connect APIs

- [x] Prepare documentation structure

- [x] Write Documentation

## Introduction

This projects aims to develop a Dashboard JIACC Investigation system.

## Node Version

- Node 16.x || 18.x

## Scripts

- Starting the project (npm start OR npm run START)

- Building the project (npm run build)

## Installation and Running

- npm i OR npm i --legacy-peer-deps

- npm start OR npm run start

## Dependencies

- @emotion/cache

- @emotion/react

- @emotion/styled

- @hello-pangea/dnd

- @hookform/resolvers

- @iconify/react

- @mui/lab

- @mui/material

- @mui/x-data-grid

- @mui/x-date-pickers

- apexcharts

- autosuggest-highlight

- axios

- clsx

- css-box-model

- date-fns

- framer-motion

- highlight.js

- history

- i18next

- i18next-browser-languagedetector

- lodash

- mui-one-time-password-input

- nprogress

- numeral

- prop-types

- qrcode

- react

- react-apexcharts

- react-dom

- react-dropzone

- react-helmet-async

- react-hook-form

- react-i18next

- react-joyride

- react-lazy-load-image-component

- react-quill

- react-router

- react-router-dom

- react-scripts

- simplebar-react

- stylis

- stylis-plugin-rtl

- swr

- yup

## MUI (Material User Interface)

Material UI is beautiful by design and features a suite of customization options that make it easy to implement your own custom design system. It is included in the project to have the ability to code themed blocks and components faster. We use MUI v5

## Folder Structure

    root
      ├── public
      ├── src
          ├── auth
          ├── components
          ├── constants
          ├── pages
          ├── hooks
          ├── locales
          ├── layouts
          ├── sections
          ├── theme
          ├── utils
          ├── routes
          ├── ...
      ├── next.config.js
      ├── package.json
      ├── ...

## Theme

- To change the theme colors, head to "src/theme/options/presets.js", you will find an object with value "jiacc" of key "name".

- To override MUI components styles, you can find overrides in "src/theme/overrides/components/\*"

- The current font is "Cairo", you can change it through "src/theme/typography"

## Layouts

We have 3 types of layouts

- Auth: "src/layouts/auth", it is the layout used for authentication pages

- Dashboard: "src/layouts/dashboard", the layout for all dashboard pages

- Compact: "src/layouts/compact", used in error pages / blank pages

## Routing and Paths

For routing, we have 2 main things:

- Paths "src/routes/paths.js", it has the path for every route in the app

- Routes Sections in "src/routes/sections/auth.js" for auth routes, "src/routes/sections/dashboard.js" for dashboardroutes, "src/routes/sections/main.js" for routes that does not require a gaurd such as "auth/no auth".

To add a new route:

- Head to "src/routes/paths.js", and decide where to locate the hyperlink

- Head to "src/routes/sections/dashboard.js" (for example), and "lazy import" the page, and put it in the preferred place in the dashboardRoutes Array.

- "index: true" is for root page at that level, thus doesnt require "path" key, if not root, then it required path key, and must eliminate "index: true", the more sub pages you have, the more nesting you would go with children.

```javascript
const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'notifications',
        children: [
          {
            index: true,
            element: <NotificationsPage />,
          },
          {
            path: ':id/assign-investigator',
            element: <NotificationsAssignInvestigatorPage />,
          },
        ],
      },
      {
        path: 'investigation',
        children: [
          {
            path: 'direct-investigation',
            element: <DirectInvestigationPage />,
          },
          {
            path: 'profile/:id',
            element: <InvestigationProfilePage />,
          },
        ],
      },
      {
        path: 'financial-disclosure',
        children: [
          {
            index: true,
            element: <FinancialDisclosureListPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
];
```

## i18n (Internationalization)

### Structure

You can find translations in "src/locales/langs/\[language].json".

    root
      ├── public
      ├── src
          ├── ...
          ├── locales
             ├── langs
                 ├── ar.json
                 ├── english.json
          ├── ...
      ├── ...

## a11y (Accessibility)

a11y features requested by JIACC, are:

- Font Size Control (-/+)

- Color Blind Support (Toggle)

- Different Cursor Modes (Normal / Big Cursors / Perk proof OR Reading Cursor)

To acheive a11y features, we have used React's ContextAPI to populate methods everywhere in the application.
You can see a11y files in "src/components/accessibility"

Structure

    root
      ├── public
      ├── src
          ├── ...
          ├── components
             ├── accessibility
                 ├── context (Context, Provider, useContext) All logic is located inside the Provider
                 ├── toolbar (The a11y toolbar components)
                 ├── index.js (Exports)
          ├── ...
      ├── ...

### Font Size Manipulation:

How It Works?\
Font size is manipulated through using relative "rem" and "em" units for font-size, then in the "HTML Tag", we control its fontSize by "% / Percentage" value, which will end manipulating "rem and em" units of components under HTML.

In "src/components/accessibility/context/accessibility-provider.js", we have the following

```javascript
 // ...
 const [rootFontSize, setRootFontSize] = useState(defaultSettings.rootFontSize);
 // ...
    // Change between MIN_FONT_SIZE_PERCENT and MAX_FONT_SIZE_PERCENT
  const onDecreaseRootFontSize = useCallback(() => {
    setRootFontSize((prev) => {
      const next = prev - 12.5;
      return next < MIN_FONT_SIZE_PERCENT ? MIN_FONT_SIZE_PERCENT : next;
    });
  }, []);
  const onIncreaseRootFontSize = useCallback(() => {
    setRootFontSize((prev) => {
      const next = prev + 12.5;
      return next > MAX_FONT_SIZE_PERCENT ? MAX_FONT_SIZE_PERCENT : next;
    });
  }, []);
 // ...

// ...
  useEffect(() => {
    document.querySelector('html').style.fontSize = `${rootFontSize}%`;
  }, [rootFontSize]);
// ...

// Here we return used values and methods, in order to use them in other components
  const memoizedValue = useMemo(
    () => ({
      // ...
      // Font Size
      rootFontSize,
      onDecreaseRootFontSize,
      onIncreaseRootFontSize,
      // ...
    }),
    [
      // ...
      rootFontSize,
      onDecreaseRootFontSize,
      onIncreaseRootFontSize,
      // ...
    ]

  return (
    <AccessibilityContext.Provider value={memoizedValue}>{children}</AccessibilityContext.Provider>
  );
```

### Color Blind

How it works?\
We toggle the color blind by setting it in the context between (True/False), this value decides if css filter "grayscale" with values of either (0 OR 1).&#x20;

```javascript
// ...
const [colorBlind, setColorBlind] = useState(defaultSettings.colorBlind);
// ...

// Toggle Color Blind
const onToggleColorBlind = useCallback(() => {
  setColorBlind((prev) => !prev);
}, []);

// ...
useEffect(() => {
  // Update * filter grayscale
  document.querySelector('*').style.filter = colorBlind ? 'grayscale(100%)' : '';
}, [colorBlind]);
// ...
const memoizedValue = useMemo(
  () => ({
    // ...
    // Color Blind
    colorBlind,
    onToggleColorBlind,
    // ...
  }),
  [
    // ...
    colorBlind,
    onToggleColorBlind,
    // ...
  ]
);

return (
  <AccessibilityContext.Provider value={memoizedValue}>{children}</AccessibilityContext.Provider>
);
```

### Cursor Mode

Cursor mode is the current styling and appearnace of the mouse cursor, there are three possible values 'auto' | 'big' | 'reading'

```javascript
// ...
const [cursorMode, setCursorMode] = useState(defaultSettings.cursorMode);
// ...

// Cursor Mode
const onChangeCursorMode = useCallback((mode) => {
  // 'auto' | 'big' | 'reading'
  setCursorMode(mode);
}, []);

// ...
useEffect(() => {
  // Update * filter grayscale
  document.querySelector('*').style.filter = colorBlind ? 'grayscale(100%)' : '';
}, [colorBlind]);
// ...
const memoizedValue = useMemo(
  () => ({
    // ...
    // Cursor Mode
    cursorMode,
    onChangeCursorMode,
    // ...
  }),
  [
    // ...
    cursorMode,
    onChangeCursorMode,
    // ...
  ]
);

return (
  <AccessibilityContext.Provider value={memoizedValue}>{children}</AccessibilityContext.Provider>
);
```

### Resetting

Here we reset all accessibility values to their defaults

```javascript
const onReset = useCallback(() => {
  setRootFontSize(defaultSettings.rootFontSize || 100);
  setColorBlind(defaultSettings.colorBlind || false);
  setCursorMode(defaultSettings.cursorMode || 'auto');
}, [defaultSettings]);
```

### Usage in another component / page / ..etc

- You must import useAccessibilityContext at the top of the file

- use the useAccessiblityContext hook as follows

```javascript

import { useAccessibilityContext } from 'src/components/accessibility';

// ----------------------------------------------------------------------

export default function AppearancePanel() {
  const accessibility = useAccessibilityContext();

  return (
    <div>
        <div>
            Current Font Percentage is {accessibility.rootFontSize}
            <button onClick={accessibility.onIncreaseRootFontSize}>Click me to increase font size</button>
            <button onClick={accessibility.onDecreaseRootFontSize}>Click me to decrease font size</button>
        </div>
        <div>
            Color blind is: {accessibility.colorBlind? "Enabled": "Disabled"}
            <button onClick={accessibility.onToggleColorBlind}>Toggle Color Blind</button>
        </div>
        <div>
            Current Cursor Mode is: {accessibility.cursorMode"}
            <button onClick={accessibility.onChangeCursorMode('auto')}>Normal Cursor</button>
            <button onClick={accessibility.onChangeCursorMode('big')}>Big Cursor</button>
            <button onClick={accessibility.onChangeCursorMode('reading')}>Reading Cursor / Perk Proof Cursor</button>
        </div>
    </div>
  );
}

```
"# kkk98" 
