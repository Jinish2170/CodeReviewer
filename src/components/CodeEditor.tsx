import { Box, TextField } from '@mui/material';
import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  placeholder 
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={12}
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
          },
        }}
      />
    </Box>
  );
};

export default CodeEditor;
