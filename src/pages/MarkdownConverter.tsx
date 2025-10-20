import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Eye, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useToolTracking } from "@/hooks/useToolTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowToUse from "@/components/HowToUse";

const MarkdownConverter = () => {
  useToolTracking("Markdown Converter");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Converter

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- \`Inline code\` and code blocks

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists
1. Numbered item 1
2. Numbered item 2

- Bullet point 1
- Bullet point 2

> This is a blockquote

---

**Try editing the markdown on the left!**`);

  const convertToHTML = (md: string): string => {
    let html = md;

    // Headers
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\_\_(.*?)\_\_/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/\_(.*?)\_/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" />');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^\-\-\-$/gim, '<hr />');
    html = html.replace(/^\*\*\*$/gim, '<hr />');

    // Ordered lists
    html = html.replace(/^\d+\.\s(.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

    // Unordered lists
    html = html.replace(/^\-\s(.+)$/gim, '<li>$1</li>');
    html = html.replace(/^\*\s(.+)$/gim, '<li>$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br />');

    return `<div>${html}</div>`;
  };

  const htmlOutput = convertToHTML(markdown);

  const copyHTML = () => {
    navigator.clipboard.writeText(htmlOutput);
    toast({
      title: "Copied!",
      description: "HTML code copied to clipboard",
    });
  };

  const downloadHTML = () => {
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "HTML file has been downloaded",
    });
  };

  const sampleTemplates = {
    documentation: `# Project Documentation

## Getting Started

### Installation
\`\`\`bash
npm install package-name
\`\`\`

### Usage
Import the package in your code:
\`\`\`javascript
import { Component } from 'package-name';
\`\`\`

## API Reference
- **method()** - Description of method
- **property** - Description of property`,
    blog: `# Blog Post Title

*Published on January 1, 2024*

## Introduction
This is the introduction paragraph...

### Main Content
Here's the main content with **important points** highlighted.

![Featured Image](https://example.com/image.jpg)

## Conclusion
Final thoughts and [useful link](https://example.com).`,
    readme: `# Project Name

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description
A brief description of your project.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
\`\`\`bash
git clone https://github.com/username/repo.git
cd repo
npm install
\`\`\`

## Contributing
Pull requests are welcome!`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* How to Use Guide */}
        <HowToUse
          steps={[
            { title: "Write Markdown", description: "Type or paste your Markdown syntax in the editor on the left." },
            { title: "See Live Preview", description: "View real-time HTML preview on the right as you type." },
            { title: "Use Templates", description: "Start with pre-made templates for docs, blogs, or README files." },
            { title: "Download HTML", description: "Export your converted HTML for use in websites or documentation." }
          ]}
          tips={[
            { text: "Supports headers, bold, italic, lists, links, and code blocks" },
            { text: "Use ``` for code blocks with syntax highlighting" },
            { text: "Templates provide starting structures for common documents" },
            { text: "Perfect for creating documentation and blog posts" }
          ]}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              Markdown to HTML Converter
            </CardTitle>
            <CardDescription>
              Convert Markdown syntax to HTML with live preview. Perfect for documentation, blogs, and content creation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMarkdown(sampleTemplates.documentation)}
              >
                Load Documentation Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMarkdown(sampleTemplates.blog)}
              >
                Load Blog Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMarkdown(sampleTemplates.readme)}
              >
                Load README Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMarkdown("")}
              >
                Clear
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Markdown Input</label>
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Enter your markdown here..."
                  className="font-mono min-h-[500px]"
                />
              </div>

              <div className="space-y-2">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      HTML Code
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="mt-4">
                    <div 
                      className="border rounded-lg p-4 min-h-[500px] bg-card prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: htmlOutput }}
                    />
                  </TabsContent>
                  <TabsContent value="html" className="mt-4">
                    <Textarea
                      value={htmlOutput}
                      readOnly
                      className="font-mono min-h-[500px]"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={copyHTML} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy HTML
              </Button>
              <Button onClick={downloadHTML} variant="outline" className="flex items-center gap-2">
                Download HTML File
              </Button>
            </div>

            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">Markdown Syntax Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-1">Headers:</p>
                    <code className="block bg-background p-2 rounded"># H1<br />## H2<br />### H3</code>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Text Formatting:</p>
                    <code className="block bg-background p-2 rounded">**bold**<br />*italic*<br />`code`</code>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Links & Images:</p>
                    <code className="block bg-background p-2 rounded">[text](url)<br />![alt](image.jpg)</code>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Lists:</p>
                    <code className="block bg-background p-2 rounded">- Bullet item<br />1. Numbered item</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MarkdownConverter;
