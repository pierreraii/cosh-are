import { useState } from "react";
import { Bill, User, Document } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Repeat,
  Clock,
  Paperclip
} from "lucide-react";

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
  users: User[];
}

export const AddBillModal = ({ isOpen, onClose, onAddBill, users }: AddBillModalProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState("");
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file), // In a real app, this would be uploaded to a server
      uploadedBy: paidBy || users[0]?.id || '',
      uploadedAt: new Date(),
      size: file.size,
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const newBill: Omit<Bill, 'id'> = {
      title: title.trim(),
      amount: parseFloat(amount),
      isRecurring,
      recurringPeriod: isRecurring ? recurringPeriod : undefined,
      date: new Date(date),
      paidBy: paidBy || undefined,
      documents: documents.length > 0 ? documents : undefined,
    };

    onAddBill(newBill);
    
    // Reset form
    setTitle("");
    setAmount("");
    setIsRecurring(false);
    setRecurringPeriod('monthly');
    setDate(new Date().toISOString().split('T')[0]);
    setPaidBy("");
    setDescription("");
    setDocuments([]);
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Add New Expense
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Expense Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Car Insurance, Maintenance, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="paidBy">Paid By (Optional)</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid this expense" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurring Configuration */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {isRecurring ? (
                    <Repeat className="h-4 w-4 text-primary" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <Label htmlFor="recurring" className="text-sm font-medium">
                    {isRecurring ? "Recurring Expense" : "One-time Expense"}
                  </Label>
                </div>
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>
              
              {isRecurring && (
                <div>
                  <Label>Recurring Period</Label>
                  <Select value={recurringPeriod} onValueChange={(value: 'monthly' | 'yearly') => setRecurringPeriod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <Label>Attach Documents (Receipts, Images, etc.)</Label>
                </div>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload files or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Images, PDFs, Documents (Max 10MB each)
                    </p>
                  </label>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Documents</Label>
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(doc.type)}
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional notes about this expense..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !amount || parseFloat(amount) <= 0}>
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};