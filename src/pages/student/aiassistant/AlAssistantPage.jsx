import React, { useState } from "react";
import SideBarStudent from "@/components/layout/SideBarStudent";
import NavBar from "@/components/layout/NavBar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  Upload,
  FileText,
  Type,
  Braces,
  Brain,
  History,
  Star,
  Share2,
  Clock,
  HelpCircle,
  BookOpen,
  Download,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentInput from "@/components/features/assistant/DocumentInput";
import SummaryResult from "@/components/features/assistant/SummaryResult";

// Structure for a summary request
const createSummaryRequest = (content, type, fileName = null) => {
  return {
    id: Date.now().toString(), // Generate unique ID
    timestamp: new Date(), // Creation time
    type: type, // Type: 'file' or 'text'
    fileName: fileName, // File name (if file)
    content: content, // Content to summarize
    summary: null, // Summary result (will be updated later)
  };
};

const RightSidebar = ({ requestHistory, onHistoryItemClick }) => {
  // Export functions
  const exportToText = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSummary = (request) => {
    const date = new Date(request.timestamp).toLocaleString();
    const type = request.type === "file" ? "Document" : "Text Input";
    const name = request.type === "file" ? request.fileName : "User Input";

    return `[${type}] ${name}
Date: ${date}
Content Length: ${request.content.length} characters
Summary Length: ${request.summary.length} characters

Summary:
${request.summary}

------------------------`;
  };

  const handleExportAll = () => {
    if (requestHistory.length === 0) {
      alert("No history to export");
      return;
    }

    const content = requestHistory.map(formatSummary).join("\n\n");

    exportToText(
      content,
      `summary-history-${new Date().toISOString().split("T")[0]}.txt`
    );
  };

  const handleExportFiles = () => {
    const fileSummaries = requestHistory.filter((req) => req.type === "file");

    if (fileSummaries.length === 0) {
      alert("No file summaries to export");
      return;
    }

    const content = fileSummaries.map(formatSummary).join("\n\n");

    exportToText(
      content,
      `file-summaries-${new Date().toISOString().split("T")[0]}.txt`
    );
  };

  const handleExportTexts = () => {
    const textSummaries = requestHistory.filter((req) => req.type === "text");

    if (textSummaries.length === 0) {
      alert("No text summaries to export");
      return;
    }

    const content = textSummaries.map(formatSummary).join("\n\n");

    exportToText(
      content,
      `text-summaries-${new Date().toISOString().split("T")[0]}.txt`
    );
  };

  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="tools">Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="mt-4">
        <div className="space-y-4">
          {requestHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No history yet</p>
            </div>
          ) : (
            requestHistory.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onHistoryItemClick(request)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {request.type === "file" ? (
                    <FileText className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Type className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium">
                    {request.type === "file" ? request.fileName : "Text Input"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(request.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {request.summary}
                </p>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="tools" className="mt-4">
        <div className="space-y-6">
          {/* Document Stats */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Document Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Documents</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {requestHistory.length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Characters</p>
                      <p className="text-2xl font-bold text-green-600">
                        {requestHistory.reduce(
                          (acc, req) => acc + (req.content?.length || 0),
                          0
                        )}
                      </p>
                    </div>
                    <Type className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Export Options</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportAll}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportFiles}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export File Summaries
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportTexts}
                >
                  <Type className="h-4 w-4 mr-2" />
                  Export Text Summaries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const AlAssistantPage = () => {
  // State management
  const [currentRequest, setCurrentRequest] = useState(null); // Current request
  const [isProcessing, setIsProcessing] = useState(false); // Processing status
  const [requestHistory, setRequestHistory] = useState([]); // Request history
  const [showHistory, setShowHistory] = useState(false); // Show history

  // Handle user submission (from DocumentInput)
  const handleSubmit = (content, fileName, type) => {
    if (!content.trim()) {
      alert("Please enter content or select a file");
      return;
    }
    processDocument(content, fileName, type);
  };

  // Process document (file or text)
  const processDocument = async (content, fileName, type) => {
    // Create new request
    const newRequest = createSummaryRequest(content, type, fileName);
    setCurrentRequest(newRequest);
    setIsProcessing(true);

    try {
      // Call API to get summary
      const response = await callSummaryAPI(content);

      // Update summary result
      const completedRequest = {
        ...newRequest,
        summary: response.summary,
      };

      // Add to history
      setRequestHistory((prevHistory) => [completedRequest, ...prevHistory]);

      // Update current request
      setCurrentRequest(completedRequest);

      alert("Summary created successfully");
    } catch (error) {
      console.error("Error processing document:", error);
      alert("An error occurred while processing the document");
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock API call (replace with real API)
  const callSummaryAPI = async (content) => {
    // TODO: Replace with real API
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            summary:
              "This is a sample summary of the provided content. In practice, this would be the result from the text summarization API.",
          }),
        1500
      )
    );
  };

  // Reset form to create new summary
  const handleReset = () => {
    setCurrentRequest(null);
  };

  const handleHistoryItemClick = (request) => {
    setCurrentRequest(request);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f9fc]">
      <SideBarStudent />
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <NavBar />

            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      AI Assistant
                    </h1>
                    <p className="text-gray-600">
                      Upload documents or paste text to get AI-powered summaries
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {!currentRequest && !isProcessing && (
                      <>
                        <Card className="border border-gray-200 shadow-sm">
                          <CardContent className="p-8">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bot className="h-8 w-8 text-blue-600" />
                              </div>
                              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                AI Document Summarization
                              </h2>
                              <p className="text-gray-600 mb-2">
                                Upload a document or paste text to get
                                AI-powered summaries
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                  <Upload className="h-6 w-6 text-gray-600" />
                                </div>
                                <p className="text-sm text-gray-600">Upload</p>
                              </div>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                  <Brain className="h-6 w-6 text-gray-600" />
                                </div>
                                <p className="text-sm text-gray-600">Analyze</p>
                              </div>
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                  <FileText className="h-6 w-6 text-gray-600" />
                                </div>
                                <p className="text-sm text-gray-600">
                                  Summarize
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Input Document */}
                        <DocumentInput onSubmit={handleSubmit} />
                      </>
                    )}

                    {isProcessing && (
                      <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-8 text-center">
                          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <h3 className="text-xl font-semibold mb-2">
                            Processing Document
                          </h3>
                          <p className="text-gray-600 mb-4">
                            AI is analyzing the content and generating
                            summary...
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Summary Result */}
                    {currentRequest?.summary && (
                      <SummaryResult
                        request={currentRequest}
                        onReset={handleReset}
                      />
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="lg:col-span-1">
                    <RightSidebar
                      requestHistory={requestHistory}
                      onHistoryItemClick={handleHistoryItemClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlAssistantPage;
