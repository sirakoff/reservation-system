// @ts-ignore

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // @ts-ignore
} from "@/components/ui/dialog";
// @ts-ignore

import { Input } from "@/components/ui/input";
// @ts-ignore

import { Label } from "@/components/ui/label";
// @ts-ignore

import { createClient } from "@/utils/supabase/client";
import moment from "moment";
import { useState } from "react";
// @ts-ignore

import { Database } from "@/supabase.ts";
const supabase = createClient<Database>();

export type ReservationSlot = {
  id: String;
  capacity: Number;
  date: String;
  start: String;
  end: String;
  calendarId: String;
  userId: String;
  remoteId: Number | String;
};

export function ReservationDialog({
  open,
  close,
  event,
  user,
}: {
  event: null | ReservationSlot;
  open: Boolean;
  close: Function;
  user: any;
}) {
  let startTime = event?.start;
  let endTime = event?.end;
  let [capacity, setCapacity] = useState(2);
  let [errorText, setErrorText] = useState("");
  let isBooked = event?.calendarId === "booked" && event?.userId === user.id;
  //   console.log(user);

  const remove = async () => {
    setErrorText("");
    const { error } = await supabase
      .from("slots")
      .delete()
      .eq("id", event?.remoteId);

    if (error) {
      setErrorText(error?.message);
    }

    close();
  };
  const save = async () => {
    setErrorText("");
    // @ts-ignore

    let startDay = moment(startTime).format("YYYY-MM-DD HH:mm");
    // @ts-ignore

    let endDay = moment(endTime).format("YYYY-MM-DD HH:mm");
    // console.log(startDay);

    let { data: tables } = await supabase
      .from("tables")
      .select("*", "slots!inner(range)'")
      .overlaps("slots.range", `[${startDay}, ${endDay}]`)
      .gte("capacity", capacity).select(`
            id, 
            capacity, 
            slots ( id, range )
    `);

    let availableTables = tables.filter((t: any) => t.slots.length === 0);

    if (!availableTables.length) return setErrorText("No Tables available");

    const { data, error: slotError } = await supabase
      .from("slots")
      .insert([
        {
          is_available: false,
          table_id: availableTables[0].id,
          range: `(${startTime}, ${endTime})`,
        },
      ])
      .select();

    // console.log(slotError, data);

    if (slotError?.message.includes("exclud_reservation_period")) {
      setErrorText("Slot already booked!");
      return;
    }

    close();
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open: Boolean) => (!open ? close() : null)}
    >
      <DialogContent className="sm:max-w-[425px]">
        {isBooked ? (
          <DialogHeader>
            <DialogTitle>Delete Reservation</DialogTitle>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle>Make Reservation (Slot available)</DialogTitle>
            <DialogDescription>Enter number of guests</DialogDescription>
          </DialogHeader>
        )}
        {isBooked ? (
          <div>
            Are you sure you want to cancel reservation? Other users will be
            able to use this slot.
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_time" className="text-right">
                Start Time
              </Label>
              <Input
                id="start_time"
                className="col-span-3"
                disabled
                value={startTime}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end_time" className="text-right">
                End Time
              </Label>
              <Input
                id="end_time"
                className="col-span-3"
                disabled
                value={endTime}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Table Capacity
              </Label>
              <Input
                id="capacity"
                className="col-span-3"
                type="number"
                min="2"
                max="8"
                value={capacity}
                onChange={(e: any) => setCapacity(e?.target?.value)}
              />
            </div>
          </div>
        )}
        <div className="text-red-500">{errorText ? errorText : null}</div>
        <DialogFooter>
          {isBooked ? (
            <Button type="submit" onClick={remove} variant="destructive">
              Delete
            </Button>
          ) : (
            <Button
              disabled={!(capacity >= 2 && capacity <= 8)}
              type="submit"
              onClick={save}
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
