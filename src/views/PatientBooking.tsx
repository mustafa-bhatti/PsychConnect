'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const slots = [
  "Mon 7:00 pm",
  "Tue 9:00 pm",
  "Wed 8:30 pm",
  "Sat 11:00 am",
  "Sun 6:00 pm",
];

const PatientBooking = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const confirmBooking = () => {
    setShowConfirmation(false);
    router.push("/patient/session");
  };

  return (
    <AppShell
      title="Booking & payment"
      description="Choose a time that works for you and confirm your payment method."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Select a time slot</CardTitle>
            <CardDescription>Times are shown in Pakistan Standard Time (PKT).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                  selectedSlot === slot
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background hover:bg-muted/70"
                }`}
              >
                {slot}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Payment</CardTitle>
            <CardDescription>Secure card and local wallet options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Session fee: <span className="font-semibold text-foreground">PKR 2,800</span>
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Choose a method</p>
              <ul className="grid gap-2 text-sm">
                <li className="rounded-lg border border-border bg-background px-3 py-2">
                  Stripe  Visa / MasterCard
                </li>
                <li className="rounded-lg border border-border bg-background px-3 py-2">
                  JazzCash (PKR wallet)
                </li>
                <li className="rounded-lg border border-border bg-background px-3 py-2">
                  EasyPaisa (PKR wallet)
                </li>
              </ul>
            </div>
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!selectedSlot}
              onClick={() => setShowConfirmation(true)}
            >
              Confirm booking &amp; pay
            </Button>
            <p className="text-[11px]">
              You&apos;ll receive an email and SMS with session details. Payments are handled securely and
              never stored by MindConnect.
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking confirmed</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your payment was successful. Your session with Dr. Ayesha Khan is booked for {selectedSlot}.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="subtle" onClick={() => setShowConfirmation(false)}>
              Close
            </Button>
            <Button variant="hero" onClick={confirmBooking}>
              Go to video session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default PatientBooking;
