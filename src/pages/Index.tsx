import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Dashboard } from "@/components/Dashboard";
import { ItemDetail } from "@/components/ItemDetail";
import { CreateItemModal } from "@/components/CreateItemModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const { user, profile, items, dashboardStats, loading, profileLoading, refreshData } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'item'>('dashboard');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome to Collective Assets</CardTitle>
            <CardDescription className="text-center">
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleViewItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentView('item');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedItemId(null);
  };

  const selectedItem = selectedItemId ? items.find(item => item.id === selectedItemId) : null;

  const handleCreateItem = async () => {
    // Refresh data after creating an item
    await refreshData();
    setIsCreateModalOpen(false);
  };

  const handleUpdateItem = async () => {
    // Refresh data after updating an item
    await refreshData();
  };

  // Use real dashboard stats or fallback to computed stats
  const displayStats = dashboardStats || {
    totalItems: items.length,
    totalValue: items.reduce((sum, item) => sum + item.total_value, 0),
    monthlyExpenses: 0,
    upcomingBookings: 0,
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader onCreateItem={() => setIsCreateModalOpen(true)} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-muted-foreground">Loading your data...</div>
            </div>
          ) : (
            <>
              {currentView === 'dashboard' && (
                <Dashboard
                  stats={displayStats}
                  items={items}
                  onViewItem={handleViewItem}
                />
              )}
              
              {currentView === 'item' && selectedItem && (
                <ItemDetail 
                  item={selectedItem}
                  onBack={handleBackToDashboard}
                  onUpdateItem={handleUpdateItem}
                />
              )}
            </>
          )}
        </div>

        <CreateItemModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateItem}
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
