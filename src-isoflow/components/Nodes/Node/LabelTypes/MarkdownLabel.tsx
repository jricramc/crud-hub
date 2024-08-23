import React from 'react';
import { Box } from '@mui/material';
import { MarkdownEditor } from '@/src-isoflow/components/MarkdownEditor/MarkdownEditor';

interface Props {
  label: string;
}

export const MarkdownLabel = ({ label }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        minWidth: 150,
        maxHeight: 300
      }}
    >
      <MarkdownEditor readOnly value={label} />
    </Box>
  );
};
