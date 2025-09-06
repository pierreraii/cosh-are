import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { ItemDetail } from "@/components/ItemDetail";
import { CreateItemModal } from "@/components/CreateItemModal";
import { mockItems, mockStats } from "@/data/mockData";
import { Item } from "@/types";

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'item'>('dashboard');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleViewItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setCurrentView('item');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedItemId(null);
  };

  const selectedItem = selectedItemId ? items.find(item => item.id === selectedItemId) : null;

  const handleCreateItem = (newItemData: Omit<Item, 'id' | 'createdAt' | 'bookings' | 'documents' | 'recurringBills' | 'oneTimeBills'>) => {
    const newItem: Item = {
      ...newItemData,
      id: `item_${Date.now()}`,
      createdAt: new Date(),
      bookings: [],
      documents: [],
      recurringBills: [],
      oneTimeBills: []
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  return (
    <Layout onCreateItem={() => setIsCreateModalOpen(true)}>
      {currentView === 'dashboard' && (
        <Dashboard 
          stats={mockStats}
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

      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateItem}
      />
    </Layout>
  );
};

export default Index;
