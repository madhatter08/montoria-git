import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/calendar.css";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";

const Calendar = () => {
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: 1,
        title: "My new event",
        start: "2025-01-01 00:00",
        end: "2025-01-01 02:00",
      },
    ],
    selectedDate: "2025-01-01",
      plugins: [createEventModalPlugin(), createDragAndDropPlugin()]
  });

  return (
    <>
      <div className="w-full max-w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[75vw] h-auto sm:h-[60vw] md:h-[53.3vw] lg:h-[50vw] overflow-y-auto rounded-xl mx-auto backdrop-blur-md shadow-lg">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </>
  );
};

export default Calendar;
