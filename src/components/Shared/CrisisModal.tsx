import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, ShieldAlert } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CrisisModal = ({ isOpen, onOpenChange }: CrisisModalProps) => {
  // In a real app, these would be dynamically fetched or configured
  const emergencyNumber = '911'; 
  const crisisHotline = '988';
  const clinicianNumber = '123-456-7890'; // Placeholder

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-destructive">
            <ShieldAlert className="w-8 h-8" />
            Immediate Help
          </DialogTitle>
          <DialogDescription>
            If you are in immediate danger, please use the resources below. Your safety is the top priority.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <a href={`tel:${emergencyNumber}`} className="w-full">
            <Button variant="destructive" className="w-full h-16 text-lg">
              <Phone className="mr-2 h-6 w-6" /> Call {emergencyNumber} (Emergency)
            </Button>
          </a>
          <a href={`tel:${crisisHotline}`} className="w-full">
            <Button variant="outline" className="w-full h-14 text-md border-primary text-primary">
              <Phone className="mr-2 h-5 w-5" /> Call {crisisHotline} (Crisis & Suicide Lifeline)
            </Button>
          </a>
           <a href={`tel:${clinicianNumber}`} className="w-full">
            <Button variant="outline" className="w-full h-14 text-md">
              <MessageCircle className="mr-2 h-5 w-5" /> Call My Clinician
            </Button>
          </a>
        </div>
        <DialogFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Help is available. Please reach out if you need support.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisModal;
