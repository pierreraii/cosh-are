import { useState } from "react";
import { Booking } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus, User, Clock } from "lucide-react";
import { BookingModal } from "./BookingModal";

interface BookingCalendarProps {
  bookings: Booking[];
  itemId: string;
  onNewBooking?: (booking: Omit<Booking, 'id' | 'status'>) => void;
}

export const BookingCalendar = ({ bookings, itemId, onNewBooking }: BookingCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Get current month info
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isDateBooked = (day: number) => {
    const date = new Date(year, month, day);
    return bookings.some(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= start && date <= end;
    });
  };

  const getBookingForDate = (day: number) => {
    const date = new Date(year, month, day);
    return bookings.find(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= start && date <= end;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const handleBookingClick = (date?: Date) => {
    setSelectedDate(date || null);
    setIsBookingModalOpen(true);
  };

  const handleNewBooking = (booking: Omit<Booking, 'id' | 'status'>) => {
    onNewBooking?.(booking);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings Summary */}
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings
              .filter(booking => new Date(booking.startDate) >= new Date())
              .slice(0, 3)
              .map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="financial-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Booking Calendar
            </CardTitle>
            <Button variant="financial" onClick={() => handleBookingClick()}>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[month]} {year}
            </h3>
            <Button variant="ghost" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2" />;
              }

              const isBooked = isDateBooked(day);
              const booking = getBookingForDate(day);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <div
                  key={day}
                  className={`
                    p-2 h-12 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors
                    ${isToday ? 'bg-primary text-primary-foreground font-semibold' : ''}
                    ${isBooked ? 'bg-warning/20 text-warning-foreground border border-warning/40' : ''}
                    ${!isBooked && !isToday ? 'hover:bg-muted/50' : ''}
                  `}
                  onClick={() => handleBookingClick(new Date(year, month, day))}
                  title={booking ? `Booked: ${booking.title}` : undefined}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning/40 border border-warning rounded-full" />
              <span className="text-sm text-muted-foreground">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBook={handleNewBooking}
        existingBookings={bookings}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
};