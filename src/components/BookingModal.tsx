import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Booking } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (booking: Omit<Booking, 'id' | 'status'>) => void;
  existingBookings: Booking[];
  selectedDate?: Date;
}

export const BookingModal = ({ isOpen, onClose, onBook, existingBookings, selectedDate }: BookingModalProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate);
  const [endDate, setEndDate] = useState<Date | undefined>(selectedDate);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !title.trim()) return;

    // Check for conflicts
    const hasConflict = existingBookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return (
        (startDate >= bookingStart && startDate <= bookingEnd) ||
        (endDate >= bookingStart && endDate <= bookingEnd) ||
        (startDate <= bookingStart && endDate >= bookingEnd)
      );
    });

    if (hasConflict) {
      alert("These dates conflict with an existing booking. Please choose different dates.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onBook({
      userId: "1", // Current user - in real app this would come from auth
      startDate,
      endDate,
      title: title.trim()
    });

    // Reset form
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
    setIsSubmitting(false);
    onClose();
  };

  const isDateUnavailable = (date: Date) => {
    return existingBookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book This Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Booking Title</Label>
            <Input
              id="title"
              placeholder="e.g., Weekend trip, Business meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={isDateUnavailable}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => 
                      isDateUnavailable(date) || (startDate ? date < startDate : false)
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Conflict Warning */}
          {startDate && endDate && existingBookings.some(booking => {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            return (
              (startDate >= bookingStart && startDate <= bookingEnd) ||
              (endDate >= bookingStart && endDate <= bookingEnd) ||
              (startDate <= bookingStart && endDate >= bookingEnd)
            );
          }) && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                ⚠️ These dates conflict with an existing booking
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="financial"
              disabled={!startDate || !endDate || !title.trim() || isSubmitting}
            >
              {isSubmitting ? (
                "Booking..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Book Item
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};