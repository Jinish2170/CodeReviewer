import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Code, Send, Assessment } from '@mui/icons-material';
import CodeEditor from './CodeEditor';
import AnalysisResults from './AnalysisResults';
import { CodeReviewRequest, AnalysisState } from '../types';
import CodeReviewService from '../services/api';

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const CodeReviewInterface: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [context, setContext] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: 'Please enter some code to analyze',
      });
      return;
    }

    setAnalysisState({ isLoading: true, result: null, error: null });

    try {
      const request: CodeReviewRequest = {
        code: code.trim(),
        language,
        context: context.trim() || undefined,
      };

      const result = await CodeReviewService.analyzeCode(request);
      setAnalysisState({ isLoading: false, result, error: null });
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const handleSampleCode = () => {
    const sampleCodes = {
      python: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total = total + num
    return total / len(numbers)

# Example with potential issues
def process_data(data):
    try:
        result = []
        for item in data:
            if item != None:
                result.append(item * 2)
        return result
    except:
        return []`,
      javascript: `function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i].price != undefined) {
            total = total + items[i].price;
        }
    }
    return total;
}

// Example with potential issues
function validateUser(user) {
    if (user.name == "") {
        return false;
    }
    if (user.email == null) {
        return false;
    }
    return true;
}`,
    };
    
    setCode(sampleCodes[language as keyof typeof sampleCodes] || sampleCodes.python);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Code Review Assistant
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Submit your code for intelligent analysis and educational feedback powered by AI.
      </Typography>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        <Box flex={1}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Code sx={{ mr: 1 }} />
              <Typography variant="h6">Code Input</Typography>
            </Box>

            <Box mb={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Programming Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Programming Language"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box mb={2}>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                placeholder={`Enter your ${SUPPORTED_LANGUAGES.find(l => l.value === language)?.label} code here...`}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                label="Context (Optional)"
                placeholder="Provide additional context about your code..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </Box>

            <Box display="flex" gap={1} mb={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalyzeCode}
                disabled={analysisState.isLoading}
                startIcon={analysisState.isLoading ? <CircularProgress size={20} /> : <Send />}
                fullWidth
              >
                {analysisState.isLoading ? 'Analyzing...' : 'Analyze Code'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleSampleCode}
                disabled={analysisState.isLoading}
              >
                Sample
              </Button>
            </Box>

            {analysisState.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {analysisState.error}
              </Alert>
            )}
          </Paper>
        </Box>

        <Box flex={1}>
          <Paper elevation={3} sx={{ p: 3, minHeight: '500px' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Assessment sx={{ mr: 1 }} />
              <Typography variant="h6">Analysis Results</Typography>
            </Box>

            {analysisState.result ? (
              <AnalysisResults result={analysisState.result} />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="400px"
                color="text.secondary"
              >
                <Assessment sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Ready for Analysis
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Enter your code and click "Analyze Code" to get intelligent feedback and suggestions.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CodeReviewInterface;
