# CodeReviewer

**CodeReviewer** is an AI-powered code review platform that analyzes source code in multiple programming languages, providing instant, actionable feedback on code quality, bugs, security vulnerabilities, maintainability, and best practices. Its interactive interface helps developers learn, improve, and write robust code with the support of AI.

---

## Features

- **Multi-language Support**: Review Python, JavaScript, TypeScript, Java, C++, Go, and more.
- **AI Code Analysis**: Detects bugs, security issues, performance bottlenecks, code smells, and best practice violations.
- **Instant Feedback**: Get real-time suggestions, explanations, and fixes for your code.
- **Rich Metrics**: Visualize lines of code, complexity, maintainability, and issue counts.
- **Educational Insights**: Learn with clear explanations, learning points, and recommended resources.
- **User-friendly UI**: Paste your code or select from built-in buggy examples to see the AI in action.
- **Custom Review Focus**: Ask the AI to focus on specific concerns (e.g., security, performance).
- **Step-by-Step Workflow**: Guided process from code input, through AI analysis, to learning and next steps.

---

## How It Works

1. **Enter or Paste Code**: Choose your language and input your code snippet.
2. **(Optional) Set Review Context**: Specify what you'd like the AI to focus on—such as performance, security, or code style.
3. **Analyze**: Click "Analyze My Code!" to let the AI review your code.
4. **Review Results**:
    - **Overall Score**: See a quality score out of 10, with a summary of key findings.
    - **Metrics**: View statistics like lines of code, complexity, maintainability, and number of issues.
    - **Issue Breakdown**: Explore AI-generated suggestions, each including:
        - Issue description and severity
        - Why it matters
        - How to fix it
        - Example code and learning resources (when available)
    - **Learning Points**: Key takeaways to improve your coding skills.
    - **Next Steps**: Actionable recommendations to enhance your code further.
5. **Try Examples or Analyze Again**: Use built-in buggy code samples to see how the AI works, or start over with new code.

---

## Example Use Cases

- **Learn to Spot Bugs**: Use sample problems to understand common errors and how to fix them.
- **Improve Security**: Catch SQL injection, unsafe eval usage, and other vulnerabilities.
- **Optimize Performance**: Identify inefficient code and get suggestions for optimization.
- **Enforce Best Practices**: Receive tips to write cleaner, more maintainable code.

---

## Technologies Used

- **Frontend**: React, Material UI, TypeScript
- **AI Analysis**: (Presumed) Backend API for AI-powered code review (API integration in `CodeReviewService`)
- **Component Highlights**:
    - `CodeReviewInterface.tsx`: Main interactive UI for code review
    - `CodeEditor`: Embedded code editor for multi-language support
    - `types/index.ts`: Strongly-typed interfaces for suggestions, metrics, and results

---

## Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Jinish2170/CodeReviewer.git
    cd CodeReviewer
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the app**:
    ```bash
    npm start
    ```

4. **Open in browser**: Visit `http://localhost:3000` (or the port shown in your terminal).

---


## License

[MIT](LICENSE)

---

## Author

Created by [Jinish2170](https://github.com/Jinish2170)

---
