import { useState } from "react";
import { Document } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, Eye, Trash2, Plus } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  itemId: string;
}

export const DocumentList = ({ documents, itemId }: DocumentListProps) => {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-destructive" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-primary" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-8 w-8 text-success" />;
      default:
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'destructive';
      case 'doc':
      case 'docx':
        return 'default';
      case 'xls':
      case 'xlsx':
        return 'success';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="financial-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Document Registry
            </CardTitle>
            <Button variant="financial" onClick={() => setShowUploadForm(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {documents.length === 0 ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p>No documents uploaded yet</p>
                <p className="text-sm">Upload important documents like contracts, receipts, and warranties</p>
              </div>
            ) : (
              <p>{documents.length} document{documents.length > 1 ? 's' : ''} in registry</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="financial-card hover:shadow-[var(--shadow-elevated)] transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* File Icon and Type */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <Badge variant={getFileTypeColor(doc.type) as any} className="text-xs mt-1">
                          {doc.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>By:</span>
                      <span className="font-medium">{doc.uploadedBy}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Categories */}
      <Card className="financial-card">
        <CardHeader>
          <CardTitle>Recommended Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Purchase Agreement", description: "Original purchase documents", icon: FileText },
              { name: "Insurance Policy", description: "Coverage and policy details", icon: FileText },
              { name: "Maintenance Records", description: "Service and repair history", icon: FileText },
              { name: "Warranties", description: "Product warranties and guarantees", icon: FileText }
            ].map((category) => (
              <div key={category.name} className="p-4 border border-dashed border-border rounded-lg text-center hover:bg-muted/30 transition-colors cursor-pointer">
                <category.icon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};