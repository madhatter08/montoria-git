// client/src/components/Calendar.jsx
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const Calendar = () => {
  const { isLoggedIn, userData, backendUrl } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [visibility, setVisibility] = useState("personal");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userData) {
      fetchEvents();
    }
  }, [isLoggedIn, userData]);

  const fetchEvents = async () => {
    if (!userData?.schoolId) { // Updated to schoolId
      toast.error("School ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/calendar/events`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log("Fetch events response:", result);
      if (result.success) {
        const filteredEvents = result.data.filter(
          (event) =>
            event.visibility === "all" ||
            (event.visibility === "personal" && event.schoolId === userData.schoolId) // Updated to schoolId
        );
        setEvents(
          filteredEvents.map((event) => ({
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            visibility: event.visibility,
            schoolId: event.schoolId, // Updated to schoolId
          }))
        );
      } else {
        toast.error("Failed to fetch events: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching events: " + error.message);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !userData) {
      toast.error("Please log in to add an event.");
      return;
    }

    if (!userData.schoolId) { // Updated to schoolId
      toast.error("School ID is missing. Please log in again.");
      return;
    }

    if (!title || !start || !end) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      toast.error("End date must be after the start date.");
      return;
    }

    const eventData = {
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      visibility,
      schoolId: userData.schoolId, // Updated to schoolId
      createdAt: new Date().toISOString(),
      createdBy: userData._id,
    };

    console.log("Sending event data:", eventData);

    try {
      const response = await fetch(`${backendUrl}/api/calendar/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.success && result.data) {
        const newEvent = {
          id: result.data._id,
          title: result.data.title,
          start: result.data.start,
          end: result.data.end,
          visibility: result.data.visibility,
          schoolId: result.data.schoolId, // Updated to schoolId
        };
        setEvents([...events, newEvent]);
        toast.success("Event added successfully and saved to database!");
        setTitle("");
        setStart("");
        setEnd("");
        setVisibility("personal");
      } else {
        toast.error("Failed to save event: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Error adding event to database: " + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!isLoggedIn || !userData) {
      toast.error("Please log in to delete an event.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/calendar/events/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.success) {
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
        setEventToDelete(null);
        toast.success("Event deleted successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting event: " + error.message);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setStart(new Date(event.start).toISOString().slice(0, 16));
    setEnd(new Date(event.end).toISOString().slice(0, 16));
    setVisibility(event.visibility);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !userData) {
      toast.error("Please log in to edit an event.");
      return;
    }

    if (!title || !start || !end) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      toast.error("End date must be after the start date.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/calendar/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          visibility,
          schoolId: userData.schoolId, // Updated to schoolId
        }),
      });
      const result = await response.json();
      if (result.success) {
        setEvents(
          events.map((e) =>
            e.id === editingEvent.id ? { ...e, title, start, end, visibility } : e
          )
        );
        setEditingEvent(null);
        toast.success("Event updated successfully!");
        setTitle("");
        setStart("");
        setEnd("");
        setVisibility("personal");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error updating event: " + error.message);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const changeMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

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
      const dayEvents = events.filter((event) => event.start.split("T")[0] === date);

      days.push(
        <div key={day} className="p-2 border border-gray-200 h-40 overflow-y-auto">
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
              <div className="text-xs text-gray-500">
                {event.visibility === "personal" ? "Personal" : "Public"}
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
    <div className="p-4 mt-1 rounded-3xl bg-gray-100 h-80">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={editingEvent ? handleSaveEdit : handleAddEvent} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
              disabled={!isLoggedIn}
            />
            <input
              type="datetime-local"
              placeholder="Start Date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
              disabled={!isLoggedIn}
            />
            <input
              type="datetime-local"
              placeholder="End Date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-1"
              required
              disabled={!isLoggedIn}
            />
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              disabled={!isLoggedIn}
            >
              <option value="personal">Personal</option>
              <option value="all">All Users</option>
            </select>
            <button
              type="submit"
              className="p-2 bg-[#4A154B] text-white rounded hover:bg-[#9568af]"
              disabled={!isLoggedIn}
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
                  setVisibility("personal");
                }}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
          {!isLoggedIn && (
            <p className="text-red-500 mt-2">Please log in to manage events.</p>
          )}
        </form>

        <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
          <button onClick={goToPreviousMonth} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
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
          <button onClick={goToNextMonth} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
            Next Month
          </button>
        </div>

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

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Calendar;