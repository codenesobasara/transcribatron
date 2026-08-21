"use client";
import { track } from "@vercel/analytics/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ComingSoonDialogProps {
  position?: string;
  children: React.ReactNode;
}

// Shown to visitors on platforms we don't ship for yet (Windows, Android).
// Wraps its trigger element; opens on click.
export function ComingSoonDialog({ position = "unknown", children }: ComingSoonDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => track("cta_comingsoon_open", { position })}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sit tight, we&apos;re working on it!</DialogTitle>
          <DialogDescription className="text-base">
            Transcribatron for Windows and Android is coming soon. In the
            meantime, it&apos;s ready for your iPhone on the App Store.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="accent">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
