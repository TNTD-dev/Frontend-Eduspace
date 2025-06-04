import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Type, Send } from "lucide-react";

/**
 * Document input component (file or text)
 * @param {Object} props
 * @param {Function} props.onSubmit - Handler function when submitting (content, fileName?, type?)
 */
const DocumentInput = ({ onSubmit }) => {
  // State for text input and drag status
  const [textInput, setTextInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Handle text submission
  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      alert("Please enter text to summarize");
      return;
    }

    onSubmit(textInput, undefined, "text");
    setTextInput("");
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload a file smaller than 10MB");
      return;
    }

    try {
      let content = "";

      // Process based on file type
      if (file.type === "text/plain") {
        content = await file.text();
      } else if (
        file.type === "application/pdf" ||
        file.type.includes("word")
      ) {
        // For PDF and Word files, send file content
        // In practice, you need to extract text from these files
        content = `[Binary file: ${file.name}]`;
        alert(
          `${file.name} has been uploaded successfully. Note: Binary file processing should be done on the server.`
        );
      } else {
        alert("Please upload PDF, DOCX, or TXT files only");
        return;
      }

      onSubmit(content, file.name, "file");
    } catch (error) {
      alert("Unable to read the uploaded file");
    }
  };

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
  });

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="text">Enter Text</TabsTrigger>
          </TabsList>

          {/* Upload File Tab */}
          <TabsContent value="upload" className="mt-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive || dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isDragActive ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 ${
                      isDragActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isDragActive ? "Drop file here" : "Upload Document"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Drag and drop a file here or click to select
                  </p>
                </div>

                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-red-500" />
                    <span className="text-xs text-gray-600">PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-xs text-gray-600">DOCX</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Type className="h-5 w-5 text-gray-500" />
                    <span className="text-xs text-gray-600">TXT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOCX, TXT • Max size: 10MB
              </p>
            </div>
          </TabsContent>

          {/* Enter Text Tab */}
          <TabsContent value="text" className="mt-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="text-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Paste your text here
                </label>
                <Textarea
                  id="text-input"
                  placeholder="Paste the text you want to summarize here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {textInput.length} characters
                </p>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Summarize
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentInput;
