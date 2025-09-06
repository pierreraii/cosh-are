import { useState } from "react";
import { Bill, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Calendar, Repeat, Clock, Paperclip } from "lucide-react";
import { AddBillModal } from "./AddBillModal";

interface BillListProps {
  recurringBills: Bill[];
  oneTimeBills: Bill[];
  users: User[];
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
}

export const BillList = ({ recurringBills, oneTimeBills, users, onAddBill }: BillListProps) => {
  const [isAddBillModalOpen, setIsAddBillModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalMonthly = recurringBills
    .filter(bill => bill.recurringPeriod === 'monthly')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalYearly = recurringBills
    .filter(bill => bill.recurringPeriod === 'yearly')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="financial-card">
          <CardContent className="flex items-center p-6">
            <Repeat className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Bills</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMonthly)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-success mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Yearly Bills</p>
              <p className="text-2xl font-bold">{formatCurrency(totalYearly)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-warning mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Annual Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMonthly * 12 + totalYearly)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Bills */}
      <Card className="financial-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Repeat className="h-5 w-5 mr-2 text-primary" />
              Recurring Bills
            </CardTitle>
            <Button variant="outline" onClick={() => setIsAddBillModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recurringBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{bill.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Due {formatDate(bill.date)} • {bill.recurringPeriod}
                      </p>
                      {bill.documents && bill.documents.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {bill.documents.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatCurrency(bill.amount)}</p>
                  <Badge variant="outline" className="text-xs">
                    {bill.recurringPeriod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* One-time Bills */}
      <Card className="financial-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-warning" />
              One-time Bills
            </CardTitle>
            <Button variant="outline" onClick={() => setIsAddBillModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add One-time Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {oneTimeBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">{bill.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Paid on {formatDate(bill.date)}
                      </p>
                      {bill.documents && bill.documents.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {bill.documents.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatCurrency(bill.amount)}</p>
                  <Badge variant="outline" className="text-xs bg-success/10 text-success">
                    Paid
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddBillModal
        isOpen={isAddBillModalOpen}
        onClose={() => setIsAddBillModalOpen(false)}
        onAddBill={onAddBill}
        users={users}
      />
    </div>
  );
};