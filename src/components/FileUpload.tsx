import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  Folder
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileItem {
  file: File;
  content: string;
  language: string;
}

interface FileUploadProps {
  onFilesChange: (files: FileItem[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    py: 'python',
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    java: 'java',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    c: 'cpp',
    go: 'go',
    html: 'html',
    htm: 'html',
    css: 'css',
    json: 'json',
    sql: 'sql',
    php: 'php',
    rb: 'ruby',
    cs: 'csharp',
    kt: 'kotlin',
    swift: 'swift',
  };
  return langMap[extension || ''] || 'plaintext';
};

const getFileTypeColor = (language: string): string => {
  const colorMap: Record<string, string> = {
    python: '#3776ab',
    javascript: '#f7df1e',
    typescript: '#3178c6',
    java: '#ed8b00',
    cpp: '#00599c',
    go: '#00add8',
    html: '#e34f26',
    css: '#1572b6',
    json: '#000000',
    sql: '#336791',
    php: '#777bb4',
    ruby: '#cc342d',
    csharp: '#239120',
    kotlin: '#7f52ff',
    swift: '#fa7343',
  };
  return colorMap[language] || '#666666';
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 10,
  acceptedFileTypes = [
    '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.cc', '.cxx', '.c', '.go',
    '.html', '.htm', '.css', '.json', '.sql', '.php', '.rb', '.cs', '.kt', '.swift'
  ]
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFileItems: FileItem[] = [];
    
    for (const file of acceptedFiles.slice(0, maxFiles - files.length)) {
      try {
        const content = await file.text();
        const language = getLanguageFromExtension(file.name);
        newFileItems.push({
          file,
          content,
          language
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }
    
    const updatedFiles = [...files, ...newFileItems];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, maxFiles, onFilesChange]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': acceptedFileTypes,
      'application/json': ['.json'],
      'application/javascript': ['.js'],
      'text/typescript': ['.ts'],
    },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Upload Area */}
      {files.length < maxFiles && (
        <Card 
          sx={{ 
            mb: 2,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            }
          }}
        >
          <CardContent 
            {...getRootProps()}
            sx={{ 
              textAlign: 'center', 
              py: 4,
              userSelect: 'none'
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload 
              sx={{ 
                fontSize: 48, 
                color: 'primary.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h6" gutterBottom>
              {isDragActive 
                ? 'Drop the files here...' 
                : 'Drag & drop code files here, or click to select'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supports: {acceptedFileTypes.slice(0, 8).join(', ')}{acceptedFileTypes.length > 8 ? ' and more...' : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum {maxFiles} files • {files.length} of {maxFiles} uploaded
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Folder sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Uploaded Files ({files.length})
              </Typography>
            </Box>
            <List dense>
              {files.map((fileItem, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: 'grey.50'
                  }}
                >
                  <ListItemIcon>
                    <InsertDriveFile sx={{ color: getFileTypeColor(fileItem.language) }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {fileItem.file.name}
                        </Typography>
                        <Chip
                          label={fileItem.language}
                          size="small"
                          sx={{
                            backgroundColor: getFileTypeColor(fileItem.language),
                            color: 'white',
                            fontSize: '10px',
                            height: '20px'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileItem.file.size)} • {fileItem.content.split('\n').length} lines
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => removeFile(index)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {files.length > 0 && (
        <Box display="flex" gap={1} justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {files.reduce((acc, f) => acc + f.content.split('\n').length, 0)} total lines across {files.length} files
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setFiles([]);
              onFilesChange([]);
            }}
            startIcon={<Delete />}
          >
            Clear All
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
