import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import CrisisModal from './CrisisModal';

const CrisisButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        className="flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <ShieldAlert className="w-5 h-5" />
        <span className="hidden sm:inline">Crisis Help</span>
      </Button>
      <CrisisModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default CrisisButton;
