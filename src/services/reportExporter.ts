import { saveAs } from 'file-saver';
import { CodeReviewResponse } from '../types';

export class ReportExporter {
  static async exportToPDF(result: CodeReviewResponse): Promise<void> {
    // For now, we'll export as HTML and let the user print to PDF
    const htmlContent = this.generateHTMLReport(result);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, 'code-review-report.html');
  }

  static async exportToJSON(result: CodeReviewResponse): Promise<void> {
    const jsonContent = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, 'code-review-report.json');
  }

  static async exportToMarkdown(result: CodeReviewResponse): Promise<void> {
    const markdownContent = this.generateMarkdownReport(result);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    saveAs(blob, 'code-review-report.md');
  }

  private static generateHTMLReport(result: CodeReviewResponse): string {
    const { suggestions, metrics, overall_score, summary, learning_points, next_steps } = result;
    
    const getScoreEmoji = (score: number) => {
      if (score >= 9) return '🏆';
      if (score >= 8) return '😊';
      if (score >= 6) return '😐';
      if (score >= 4) return '😟';
      return '💥';
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Review Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .score {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .summary {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .metric-label {
            color: #666;
            font-size: 0.9em;
        }
        .section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }
        .section-header {
            background: #667eea;
            color: white;
            padding: 15px 20px;
            font-size: 1.2em;
            font-weight: bold;
        }
        .section-content {
            padding: 20px;
        }
        .issue {
            border-left: 4px solid;
            padding: 15px;
            margin: 10px 0;
            border-radius: 0 8px 8px 0;
            background: #f9f9f9;
        }
        .issue.critical, .issue.error {
            border-left-color: #f44336;
            background: #ffebee;
        }
        .issue.warning {
            border-left-color: #ff9800;
            background: #fff3e0;
        }
        .issue.info {
            border-left-color: #2196f3;
            background: #e3f2fd;
        }
        .issue-title {
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 5px;
        }
        .issue-meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }
        .issue-description {
            margin-bottom: 10px;
        }
        .code-example {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 10px 0;
        }
        .learning-item, .next-step-item {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .learning-item:last-child, .next-step-item:last-child {
            border-bottom: none;
        }
        .number-badge {
            display: inline-block;
            background: #667eea;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            text-align: center;
            font-weight: bold;
            margin-right: 10px;
            font-size: 0.9em;
            line-height: 24px;
        }
        @media (max-width: 768px) {
            .metrics {
                grid-template-columns: 1fr;
            }
            body {
                padding: 10px;
            }
        }
        @media print {
            body {
                background: white;
            }
            .section {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="score">${getScoreEmoji(overall_score)} ${overall_score.toFixed(1)}/10</div>
        <div class="summary">${summary}</div>
    </div>

    <div class="metrics">
        <div class="metric-card">
            <div class="metric-value">${metrics.lines_of_code}</div>
            <div class="metric-label">Lines of Code</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${metrics.complexity_score.toFixed(1)}</div>
            <div class="metric-label">Complexity Score</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${metrics.maintainability_index.toFixed(0)}%</div>
            <div class="metric-label">Maintainability</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${suggestions.length}</div>
            <div class="metric-label">Total Issues</div>
        </div>
    </div>

    ${suggestions.length > 0 ? `
    <div class="section">
        <div class="section-header">🐛 Issues Found (${suggestions.length})</div>
        <div class="section-content">
            ${suggestions.map((suggestion, index) => `
                <div class="issue ${suggestion.severity}">
                    <div class="issue-title">${suggestion.title}</div>
                    <div class="issue-meta">Line ${suggestion.line_number} • ${suggestion.type.replace(/_/g, ' ')} • ${suggestion.severity}</div>
                    <div class="issue-description"><strong>Issue:</strong> ${suggestion.description}</div>
                    <div><strong>Why this matters:</strong> ${suggestion.explanation}</div>
                    ${suggestion.suggested_fix ? `<div><strong>How to fix:</strong> ${suggestion.suggested_fix}</div>` : ''}
                    ${suggestion.code_example ? `<div class="code-example">${suggestion.code_example}</div>` : ''}
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${learning_points.length > 0 ? `
    <div class="section">
        <div class="section-header">📚 Key Learning Points</div>
        <div class="section-content">
            ${learning_points.map((point, index) => `
                <div class="learning-item">
                    <span class="number-badge">${index + 1}</span>${point}
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${next_steps.length > 0 ? `
    <div class="section">
        <div class="section-header">✅ Recommended Next Steps</div>
        <div class="section-content">
            ${next_steps.map((step, index) => `
                <div class="next-step-item">
                    <span class="number-badge">${index + 1}</span>${step}
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
        Generated by AI Code Detective • ${new Date().toLocaleDateString()}
    </div>
</body>
</html>`;
  }

  private static generateMarkdownReport(result: CodeReviewResponse): string {
    const { suggestions, metrics, overall_score, summary, learning_points, next_steps } = result;
    
    const getScoreEmoji = (score: number) => {
      if (score >= 9) return '🏆';
      if (score >= 8) return '😊';
      if (score >= 6) return '😐';
      if (score >= 4) return '😟';
      return '💥';
    };

    let markdown = `# Code Review Report\n\n`;
    markdown += `## Overall Score: ${getScoreEmoji(overall_score)} ${overall_score.toFixed(1)}/10\n\n`;
    markdown += `${summary}\n\n`;
    
    markdown += `## 📊 Code Metrics\n\n`;
    markdown += `- **Lines of Code:** ${metrics.lines_of_code}\n`;
    markdown += `- **Complexity Score:** ${metrics.complexity_score.toFixed(1)}\n`;
    markdown += `- **Maintainability:** ${metrics.maintainability_index.toFixed(0)}%\n`;
    markdown += `- **Issues Found:** ${suggestions.length}\n\n`;

    if (suggestions.length > 0) {
      markdown += `## 🐛 Issues Found (${suggestions.length})\n\n`;
      suggestions.forEach((suggestion, index) => {
        markdown += `### ${index + 1}. ${suggestion.title}\n\n`;
        markdown += `**Severity:** ${suggestion.severity} | **Type:** ${suggestion.type.replace(/_/g, ' ')} | **Line:** ${suggestion.line_number}\n\n`;
        markdown += `**Issue:** ${suggestion.description}\n\n`;
        markdown += `**Why this matters:** ${suggestion.explanation}\n\n`;
        if (suggestion.suggested_fix) {
          markdown += `**How to fix:** ${suggestion.suggested_fix}\n\n`;
        }
        if (suggestion.code_example) {
          markdown += `**Better approach:**\n\`\`\`\n${suggestion.code_example}\n\`\`\`\n\n`;
        }
        markdown += `---\n\n`;
      });
    }

    if (learning_points.length > 0) {
      markdown += `## 📚 Key Learning Points\n\n`;
      learning_points.forEach((point, index) => {
        markdown += `${index + 1}. ${point}\n`;
      });
      markdown += `\n`;
    }

    if (next_steps.length > 0) {
      markdown += `## ✅ Recommended Next Steps\n\n`;
      next_steps.forEach((step, index) => {
        markdown += `${index + 1}. ${step}\n`;
      });
      markdown += `\n`;
    }

    markdown += `---\n*Generated by AI Code Detective on ${new Date().toLocaleDateString()}*\n`;
    
    return markdown;
  }
}
