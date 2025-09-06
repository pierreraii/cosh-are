import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings, User, Bell } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  onCreateItem?: () => void;
}

export const Layout = ({ children, onCreateItem }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="financial-card-elevated border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  CO
                </div>
                <h1 className="text-xl font-bold text-foreground">CoOwn</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
              {onCreateItem && (
                <Button variant="financial" onClick={onCreateItem}>
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};