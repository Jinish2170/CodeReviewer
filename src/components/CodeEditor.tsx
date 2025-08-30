import { Box, Paper, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  height?: string;
  annotations?: Array<{
    line: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>;
  readOnly?: boolean;
}

const getMonacoLanguage = (lang: string): string => {
  const languageMap: Record<string, string> = {
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
    html: 'html',
    css: 'css',
    json: 'json',
    sql: 'sql',
  };
  return languageMap[lang] || 'plaintext';
};

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  placeholder,
  height = '400px',
  annotations = [],
  readOnly = false
}) => {
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      minimap: { enabled: true },
      folding: true,
      wordWrap: 'on',
      theme: 'vs-dark',
      automaticLayout: true,
    });

    // Add annotations if provided
    if (annotations.length > 0) {
      const markers = annotations.map(annotation => ({
        startLineNumber: annotation.line,
        startColumn: 1,
        endLineNumber: annotation.line,
        endColumn: 1000,
        message: annotation.message,
        severity: monaco.MarkerSeverity[annotation.severity.toUpperCase()] || monaco.MarkerSeverity.Info,
      }));
      
      monaco.editor.setModelMarkers(editor.getModel(), 'owner', markers);
    }
  };

  return (
    <Box>
      <Paper 
        elevation={2} 
        sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden',
          '& .monaco-editor': {
            borderRadius: '8px',
          }
        }}
      >
        {placeholder && !value && (
          <Box 
            sx={{ 
              position: 'absolute', 
              zIndex: 1, 
              p: 2, 
              color: 'text.secondary',
              pointerEvents: 'none'
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {placeholder}
            </Typography>
          </Box>
        )}
        <Editor
          height={height}
          language={getMonacoLanguage(language)}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            theme: 'vs-dark',
            fontSize: 14,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            minimap: { enabled: true },
            folding: true,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorStyle: 'line',
            renderWhitespace: 'boundary',
          }}
        />
      </Paper>
    </Box>
  );
};

export default CodeEditor;
