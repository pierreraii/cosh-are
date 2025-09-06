import { DashboardStats, Item } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calendar, FileText, Eye } from "lucide-react";
import { OwnershipChart } from "./OwnershipChart";

interface DashboardProps {
  stats: DashboardStats;
  items: Item[];
  onViewItem: (itemId: string) => void;
}

export const Dashboard = ({ stats, items, onViewItem }: DashboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to your Co-ownership Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your shared assets, track expenses, and coordinate with co-owners seamlessly
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="financial-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Co-owned assets</p>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Combined portfolio</p>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">Recurring costs</p>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Items Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Your Co-owned Items</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="financial-card-elevated hover:shadow-[var(--shadow-hero)] transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {item.owners.length} owner{item.owners.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Value */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Value</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(item.value)}
                  </span>
                </div>

                {/* Ownership Breakdown */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Ownership</span>
                  <OwnershipChart owners={item.owners} />
                </div>

                {/* Monthly Costs */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Costs</span>
                  <span className="text-sm font-semibold text-warning">
                    {formatCurrency(
                      item.recurringBills
                        .filter(bill => bill.recurringPeriod === 'monthly')
                        .reduce((sum, bill) => sum + bill.amount, 0)
                    )}
                  </span>
                </div>

                {/* Next Booking */}
                {item.bookings.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Next Booking</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(item.bookings[0].startDate).toLocaleDateString()}
                    </Badge>
                  </div>
                )}

                {/* Actions */}
                <Button 
                  variant="outline" 
                  className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                  onClick={() => onViewItem(item.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};