import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Share2,
  RotateCcw,
  CheckCircle,
  Type,
  Copy,
  Ruler,
  Hash,
  Scissors,
} from "lucide-react";

const SummaryResult = ({ request, onReset }) => {
  const handleDownload = () => {
    const content = `${request.type === "file" ? "Document" : "Text Input"}: ${
      request.fileName || "User Input"
    }
Timestamp: ${request.timestamp.toLocaleString()}

Original Content:
${request.content}

AI Summary:
${request.summary}`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `summary-${request.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Summary of ${request.fileName || "Text Input"}`,
          text: request.summary,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(request.summary || "");
      alert("Summary has been copied to your clipboard");
    }
  };

  const handleCopyContent = async () => {
    await navigator.clipboard.writeText(request.summary || "");
    alert("The summary has been copied to your clipboard");
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              {request.type === "file" ? (
                <FileText className="h-5 w-5 text-blue-600" />
              ) : (
                <Type className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">
                AI Summary
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {request.fileName || "Text Input"} •{" "}
                {request.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Content with preserved whitespace */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>AI-Generated Summary</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyContent}
              className="text-gray-600 hover:text-gray-900"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200 max-h-96 overflow-y-auto">
            <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {request.summary}
            </pre>
          </div>
        </div>

        {/* Request Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              Input Type
            </h4>
            <p className="text-xs text-gray-600 capitalize flex items-center">
              {request.type === "file" ? (
                <FileText className="h-3 w-3 mr-1 text-blue-400" />
              ) : (
                <Type className="h-3 w-3 mr-1 text-green-400" />
              )}
              {request.type}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center">
              <Ruler className="h-4 w-4 mr-2 text-purple-500" />
              Content Length
            </h4>
            <p className="text-xs text-gray-600 flex items-center">
              <Hash className="h-3 w-3 mr-1 text-purple-400" />
              {request.content.length} characters
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center">
              <Scissors className="h-4 w-4 mr-2 text-orange-500" />
              Summary Length
            </h4>
            <p className="text-xs text-gray-600 flex items-center">
              <Hash className="h-3 w-3 mr-1 text-orange-400" />
              {request.summary?.length || 0} characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 sm:flex-none border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
          >
            <Download className="h-4 w-4 mr-2 text-blue-500" />
            Download
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 sm:flex-none border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2 text-green-500" />
            Share
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1 sm:flex-none border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2 text-blue-500" />
            New Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryResult;
