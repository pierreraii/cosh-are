import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users, DollarSign } from "lucide-react";
import { Item, User } from "@/types";
import { mockUsers } from "@/data/mockData";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: Omit<Item, 'id' | 'createdAt' | 'bookings' | 'documents' | 'recurringBills' | 'oneTimeBills'>) => void;
}

interface OwnerInput {
  userId: string;
  percentage: number;
}

export const CreateItemModal = ({ isOpen, onClose, onCreate }: CreateItemModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [owners, setOwners] = useState<OwnerInput[]>([{ userId: "", percentage: 100 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOwner = () => {
    if (owners.length < 5) {
      // Recalculate percentages to split evenly
      const newOwnerCount = owners.length + 1;
      const evenPercentage = Math.floor(100 / newOwnerCount);
      const remainder = 100 - (evenPercentage * newOwnerCount);
      
      const updatedOwners = owners.map((owner, index) => ({
        ...owner,
        percentage: index === 0 ? evenPercentage + remainder : evenPercentage
      }));
      
      setOwners([...updatedOwners, { userId: "", percentage: evenPercentage }]);
    }
  };

  const removeOwner = (index: number) => {
    if (owners.length > 1) {
      const newOwners = owners.filter((_, i) => i !== index);
      // Redistribute percentages evenly
      const evenPercentage = Math.floor(100 / newOwners.length);
      const remainder = 100 - (evenPercentage * newOwners.length);
      
      setOwners(newOwners.map((owner, i) => ({
        ...owner,
        percentage: i === 0 ? evenPercentage + remainder : evenPercentage
      })));
    }
  };

  const updateOwnerUser = (index: number, userId: string) => {
    const newOwners = [...owners];
    newOwners[index].userId = userId;
    setOwners(newOwners);
  };

  const updateOwnerPercentage = (index: number, percentage: number) => {
    const newOwners = [...owners];
    newOwners[index].percentage = percentage;
    setOwners(newOwners);
  };

  const getTotalPercentage = () => {
    return owners.reduce((sum, owner) => sum + owner.percentage, 0);
  };

  const getAvailableUsers = (currentIndex: number) => {
    const selectedUserIds = owners
      .filter((_, index) => index !== currentIndex)
      .map(owner => owner.userId)
      .filter(Boolean);
    
    return mockUsers.filter(user => !selectedUserIds.includes(user.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !value || getTotalPercentage() !== 100) {
      return;
    }

    // Validate all owners have users selected
    if (owners.some(owner => !owner.userId)) {
      alert("Please select a user for each owner.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const itemOwners = owners.map(owner => ({
      user: mockUsers.find(user => user.id === owner.userId)!,
      percentage: owner.percentage
    }));

    onCreate({
      title: title.trim(),
      description: description.trim(),
      value: parseFloat(value),
      owners: itemOwners,
      createdBy: "1" // Current user
    });

    // Reset form
    setTitle("");
    setDescription("");
    setValue("");
    setOwners([{ userId: "", percentage: 100 }]);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Co-owned Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input
                id="title"
                placeholder="e.g., Tesla Model 3, Vacation Cabin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item, its features, location, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="value"
                  type="number"
                  placeholder="45000"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ownership Structure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Co-ownership Structure
              </Label>
              <Badge variant={getTotalPercentage() === 100 ? "default" : "destructive"}>
                Total: {getTotalPercentage()}%
              </Badge>
            </div>

            <div className="space-y-3">
              {owners.map((owner, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Select
                      value={owner.userId}
                      onValueChange={(value) => updateOwnerUser(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select co-owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableUsers(index).map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-20">
                    <Input
                      type="number"
                      value={owner.percentage}
                      onChange={(e) => updateOwnerPercentage(index, parseInt(e.target.value) || 0)}
                      min="1"
                      max="100"
                      className="text-center"
                    />
                  </div>
                  
                  <span className="text-sm text-muted-foreground">%</span>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOwner(index)}
                    disabled={owners.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {owners.length < 5 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOwner}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Co-owner
              </Button>
            )}

            {getTotalPercentage() !== 100 && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning">
                  ⚠️ Ownership percentages must total exactly 100%
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="financial"
              disabled={
                !title.trim() || 
                !description.trim() || 
                !value || 
                getTotalPercentage() !== 100 || 
                owners.some(owner => !owner.userId) ||
                isSubmitting
              }
            >
              {isSubmitting ? "Creating..." : "Create Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};