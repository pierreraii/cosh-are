import { useState } from "react";
import { Item, Booking, Bill } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, DollarSign, Users, Calendar, FileText, Plus } from "lucide-react";
import { OwnershipChart } from "./OwnershipChart";
import { BillList } from "./BillList";
import { BookingCalendar } from "./BookingCalendar";
import { DocumentList } from "./DocumentList";

interface ItemDetailProps {
  item: Item;
  onBack: () => void;
  onUpdateItem?: (updatedItem: Item) => void;
}

export const ItemDetail = ({ item, onBack, onUpdateItem }: ItemDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentItem, setCurrentItem] = useState(item);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalMonthlyBills = currentItem.recurringBills
    .filter(bill => bill.recurringPeriod === 'monthly')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalYearlyBills = currentItem.recurringBills
    .filter(bill => bill.recurringPeriod === 'yearly')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const handleNewBooking = (booking: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `bk_${Date.now()}`,
      status: 'confirmed'
    };
    
    const updatedItem = {
      ...currentItem,
      bookings: [...currentItem.bookings, newBooking]
    };
    
    setCurrentItem(updatedItem);
    onUpdateItem?.(updatedItem);
  };

  const handleNewBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedItem = {
      ...currentItem,
      recurringBills: bill.isRecurring 
        ? [...currentItem.recurringBills, newBill]
        : currentItem.recurringBills,
      oneTimeBills: !bill.isRecurring 
        ? [...currentItem.oneTimeBills, newBill]
        : currentItem.oneTimeBills
    };
    
    setCurrentItem(updatedItem);
    onUpdateItem?.(updatedItem);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Item Header */}
      <div className="financial-card-elevated">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{currentItem.title}</CardTitle>
              <p className="text-muted-foreground text-lg">
                {currentItem.description}
              </p>
            </div>
            <Badge variant="outline" className="text-lg py-2 px-4">
              {formatCurrency(currentItem.value)}
            </Badge>
          </div>
        </CardHeader>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="financial-card">
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Value</p>
              <p className="text-2xl font-bold">{formatCurrency(currentItem.value)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Users className="h-8 w-8 text-success mr-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Co-owners</p>
                <p className="text-2xl font-bold">{currentItem.owners.length}</p>
              </div>
            </div>
            <div className="space-y-1">
              {currentItem.owners.map((owner) => (
                <div key={owner.user.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{owner.user.name}</span>
                  <span className="font-medium">{owner.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-warning mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bookings</p>
              <p className="text-2xl font-bold">{currentItem.bookings.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-muted-foreground mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documents</p>
              <p className="text-2xl font-bold">{currentItem.documents.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ownership">Ownership</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ownership Summary */}
            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Ownership Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <OwnershipChart owners={currentItem.owners} />
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="financial-card">
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Asset Value</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(currentItem.value)}
                  </span>
                </div>
                <div className="border-b pb-4 space-y-2">
                  {currentItem.owners.map((owner) => (
                    <div key={owner.user.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{owner.user.name} ({owner.percentage}%)</span>
                      <span className="font-medium">
                        {formatCurrency((currentItem.value * owner.percentage) / 100)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Monthly Expenses</span>
                  <span className="font-semibold text-warning">
                    {formatCurrency(totalMonthlyBills)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Yearly Expenses</span>
                  <span className="font-semibold text-warning">
                    {formatCurrency(totalYearlyBills)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Annual Cost</span>
                    <span className="font-bold text-destructive">
                      {formatCurrency(totalMonthlyBills * 12 + totalYearlyBills)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="financial-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentItem.oneTimeBills.slice(0, 3).map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{bill.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(bill.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{formatCurrency(bill.amount)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership">
          <Card className="financial-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ownership Details</CardTitle>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Co-owner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <OwnershipChart owners={currentItem.owners} />
              
              {/* Detailed breakdown */}
              <div className="mt-6 space-y-4">
                {currentItem.owners.map((owner) => (
                  <Card key={owner.user.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                          {owner.user.avatar || owner.user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{owner.user.name}</p>
                          <p className="text-sm text-muted-foreground">{owner.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{owner.percentage}%</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency((currentItem.value * owner.percentage) / 100)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <BillList 
            recurringBills={currentItem.recurringBills}
            oneTimeBills={currentItem.oneTimeBills}
            users={currentItem.owners.map(owner => owner.user)}
            onAddBill={handleNewBill}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <BookingCalendar 
            bookings={currentItem.bookings}
            itemId={currentItem.id}
            onNewBooking={handleNewBooking}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentList 
            documents={currentItem.documents}
            itemId={currentItem.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};