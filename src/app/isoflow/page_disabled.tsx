"use client"

// This is a development entry point for the app.
// It is not used in production or included in the build.
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';

import { themeConfig } from '@/src-isoflow/styles/theme';
import { BasicEditor } from '@/src-isoflow/examples/BasicEditor/BasicEditor';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';


export default function Page({}) {

  return (
    <>
      <ThemeProvider theme={createTheme({ ...themeConfig, palette: {} })}>
        <BasicEditor />
      </ThemeProvider>
    </>
  )

};
