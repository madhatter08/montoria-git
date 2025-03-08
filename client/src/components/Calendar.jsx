import { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false); 

  const handleAddEvent = (e) => {
    e.preventDefault();

    if (!title || !start || !end) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      toast.error("End date must be after the start date.");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const newEvents = [];

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const eventDate = new Date(date).toISOString().split("T")[0];
      newEvents.push({
        id: Date.now() + Math.random(),
        title,
        start: new Date(date).toISOString(),
        end: new Date(date).toISOString(),
      });
    }

    setEvents([...events, ...newEvents]);
    toast.success("Event added successfully!");

    setTitle("");
    setStart("");
    setEnd("");
  };

  // Delete an event
  const handleDeleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
    setEventToDelete(null);
    toast.success("Event deleted successfully!");
  };

  // Edit an event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setStart(new Date(event.start).toISOString().slice(0, 16));
    setEnd(new Date(event.end).toISOString().slice(0, 16));
  };

  // Save the edited event
  const handleSaveEdit = (e) => {
    e.preventDefault();

    if (!title || !start || !end) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      toast.error("End date must be after the start date.");
      return;
    }

    const updatedEvents = events.map((e) =>
      e.id === editingEvent.id
        ? {
            ...e,
            title,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
          }
        : e
    );

    setEvents(updatedEvents);
    setEditingEvent(null);
    toast.success("Event updated successfully!");

    setTitle("");
    setStart("");
    setEnd("");
  };

  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Change the month
  const changeMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false); // Close the month picker
  };

  // Get the days in the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Render the calendar grid
  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split("T")[0];
      const dayEvents = events.filter(
        (event) => event.start.split("T")[0] === date
      );

      days.push(
        <div
          key={day}
          className="p-2 border border-gray-200 h-40 overflow-y-auto"
        >
          <div className="font-bold">{day}</div>
          {dayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm bg-blue-100 p-1 rounded mt-1 cursor-pointer"
              onClick={() => handleEditEvent(event)}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-xs text-gray-600">
                {new Date(event.start).toLocaleTimeString()} -{" "}
                {new Date(event.end).toLocaleTimeString()}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEventToDelete(event.id);
                }}
                className="text-red-500 text-xs mt-1"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      );

      if (days.length === 7) {
        weeks.push(
          <div key={weeks.length} className="grid grid-cols-7 gap-1">
            {days}
          </div>
        );
        days = [];
      }
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(<div key={`empty-end-${days.length}`} className="p-2"></div>);
      }
      weeks.push(
        <div key={weeks.length} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
    }

    return weeks;
  };

  return (
    <div className="p-4 mt-1 rounded-3xl bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Add/Edit Event Form */}
        <form
          onSubmit={editingEvent ? handleSaveEdit : handleAddEvent}
          className="mb-6 p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
            />
            <input
              type="datetime-local"
              placeholder="Start Date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
            />
            <input
              type="datetime-local"
              placeholder="End Date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
            />
            <button
              type="submit"
              className="p-2 bg-[#9d16be] text-white rounded hover:bg-[#9568af]"
            >
              {editingEvent ? "Save Changes" : "Add Event"}
            </button>
            {editingEvent && (
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setTitle("");
                  setStart("");
                  setEnd("");
                }}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
          <button
            onClick={goToPreviousMonth}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous Month
          </button>
          <div className="relative">
            <h2
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="text-xl font-bold cursor-pointer"
            >
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            {showMonthPicker && (
              <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    onClick={() => changeMonth(i)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={goToNextMonth}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next Month
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm p-4 w-full">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 font-bold text-center">
                {day}
              </div>
            ))}
          </div>
          {renderCalendarGrid()}
        </div>

        {/* Confirmation Modal */}
        {eventToDelete && (
          <div className="fixed inset-0 bg-transparent shadow-5xl bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this event?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEventToDelete(null)}
                  className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(eventToDelete)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Calendar;