"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { viewDay } from "@schedule-x/calendar";

import "@schedule-x/theme-default/dist/index.css";

import { createEventsServicePlugin } from "@schedule-x/events-service";
import moment from "moment";

import { ReservationDialog } from "./ReservationDialog";
import { useEffect, useState } from "react";
// @ts-ignore

import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
const eventsServicePlugin = createEventsServicePlugin();

function TimeTable({ user }: { user: any }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  let dayBoundaries = {
    start: "09:00",
    end: "00:00",
  };
  let startDay = moment().format("YYYY-MM-DD");
  let startTime = moment(`${startDay} ${dayBoundaries.start}`);

  let currentViewDay = startDay;

  supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "slots" },
      (payload: any) => {
        // console.log("Change received!", payload);

        if (payload.eventType === "DELETE") {
          let events = eventsServicePlugin?.getAll();
          let event = events.find((e) => e.remoteId === payload?.old.id);

          if (event) {
            event.calendarId = "available";
            event.title = "+ Available";
            event.remoteId = null;

            eventsServicePlugin?.update(event);
          }

          return;
        }

        let slot = payload?.new;

        if (!slot) return;

        let range = JSON.parse(
          slot.range.replaceAll("(", "[").replaceAll(")", "]")
        );

        let startTime = moment(range[0]);

        // console.log(startTime);

        let id = `${startTime.format("YYYY-MM-DD-HH-mm")}`;

        let event = eventsServicePlugin?.get(id);

        if (event) {
          event.calendarId = "booked";
          event.title = "Booked";

          eventsServicePlugin?.update(event);
        }
      }
    )
    .subscribe();

  function updateSlots(startDay: any) {
    supabase
      .from("slots")
      .select("*")
      .overlaps("range", `[${startDay} 09:00, ${startDay} 23:59]`)
      .then((res: any) => {
        let { data: _slots, error } = res;

        _slots?.forEach((s: any) => {
          //   console.log(s);
          let range = JSON.parse(
            s.range.replaceAll("(", "[").replaceAll(")", "]")
          );

          let startTime = moment(range[0]);

          let id = `${startDay}-${startTime.format("HH-mm")}`;

          let event = eventsServicePlugin?.get(id);

          //   console.log(event);

          if (event) {
            event.calendarId = "booked";
            event.title = "Booked";
            event.remoteId = s.id;
            event.userId = s.user_id;

            eventsServicePlugin?.update(event);
          }
        });
      });
  }

  useEffect(() => {
    updateSlots(startDay);
  });

  let slots = [...Array(15)].map((_, index) => {
    let id = `${startDay}-${startTime.format("HH-mm")}`;

    return {
      id: id,
      title: "+ Available",
      start: startTime.format("YYYY-MM-DD HH:mm"),
      end: startTime.add(1, "hour").format("YYYY-MM-DD HH:mm"),
      calendarId: "available",
    };
  });

  const calendar = useNextCalendarApp({
    dayBoundaries: dayBoundaries,
    isResponsive: true,
    minDate: moment().format("YYYY-MM-DD"),
    isDark: false,
    defaultView: viewDay.name,
    views: [viewDay],
    plugins: [eventsServicePlugin],
    callbacks: {
      onEventClick(calendarEvent: any) {
        // alert(`onEventClick: ${JSON.stringify(calendarEvent)}`);

        if (!calendarEvent.userId || calendarEvent.userId === user.id) {
          setDialogOpen(true);
          setSelectedSlot(calendarEvent);
        }
      },
      onSelectedDateUpdate(date) {
        // console.log("onSelectedDateUpdate", date);

        currentViewDay = date;

        const startDay = moment(date).format("YYYY-MM-DD");
        const startTime = moment(`${startDay} ${dayBoundaries.start}`);

        let slots = [...Array(15)].map((_, index) => {
          let id = `${startDay}-${startTime.format("HH-mm")}`;

          return {
            id: id,
            title: "+ Available",
            start: startTime.format("YYYY-MM-DD HH:mm"),
            end: startTime.add(1, "hour").format("YYYY-MM-DD HH:mm"),
            calendarId: "available",
          };
        });

        slots?.forEach((s) => {
          if (!eventsServicePlugin?.get(`${s.id}`)) {
            eventsServicePlugin?.add(s);
          }
        });

        updateSlots(startDay);
      },
    },

    calendars: {
      available: {
        colorName: "personal",
        lightColors: {
          main: "#15803d",
          container: "#15803d",
          onContainer: "#ffffff",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#15803d",
        },
      },
      booked: {
        colorName: "work",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
    },
    events: slots,
  });

  return (
    <div>
      {/* <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
      <ScheduleXCalendar calendarApp={calendar} />
      <ReservationDialog
        event={selectedSlot}
        open={dialogOpen}
        close={() => setDialogOpen(false)}
        user={user}
      />
    </div>
  );
}

export default TimeTable;
