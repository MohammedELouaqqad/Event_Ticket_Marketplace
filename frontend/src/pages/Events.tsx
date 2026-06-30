import { useContext, useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";

import NavBar from "../Components/NavBar";
import EventCard from "../Components/EventCard";
import AddingEvent from "../Components/AddingEvent";
import Footer from "../Components/layout/Footer";
import SearchInput from "../Components/ui/SearchInput";
import EmptyState from "../Components/ui/EmptyState";
import { EventCardSkeleton } from "../Components/ui/Skeleton";
import Button from "../Components/ui/Button";
import { type Event } from "../types/index";
import { UserContext } from "../context/UserContext";
import api from "../lib/api"


function Events() {
  const [showAddingPage, setShowAddingPage] = useState(false);
  const [filterEvents, setFilterEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  var token = localStorage.getItem("token");

  const context = useContext(UserContext);
  if (!context) return null;

  const { userConnected } = context;


  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await api.get("/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setAllEvents(response.data);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  type getFilterEventsProps = {
    query: string;
    allEvents: Event[];
  };

  useEffect(() => {
    const getFilterEvents = ({ query, allEvents }: getFilterEventsProps) => {
      if (!query) {
        return allEvents;
      }
      return allEvents.filter((event: Event) =>
        event.name?.toLowerCase().includes(query.toLowerCase())
      );
    };

    setFilterEvents(getFilterEvents({ query, allEvents }));
  }, [query, allEvents]);






  console.log(userConnected)
  
  
  
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      {!showAddingPage ? (
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-slide-up">
            <div>
              <p className="text-sm font-medium text-brand-600">
                Welcome back, {userConnected?.name}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">
                Upcoming Events
              </h1>
              <p className="mt-2 text-slate-500">
                Discover & book tickets for amazing events
                {!loading && (
                  <span className="ml-2 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {filterEvents.length} event{filterEvents.length !== 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
          
          {userConnected?.role === "ADMIN" && (
            <Button onClick={() => setShowAddingPage(true)}>
              Add Event
            </Button>
          )}
          </div>

          {/* Search */}
          <SearchInput
            value={query}
            onChange={setQuery}
            className="mb-8 animate-slide-up"
          />

          {/* Events grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filterEvents.length === 0 ? (
            <EmptyState
              icon={<IoCalendarOutline className="text-3xl" />}
              title={query ? "No events found" : "No events yet"}
              description={
                query
                  ? `No results for "${query}". Try a different search term.`
                  : "Be the first to list an event on TRICKER."
              }
              actionLabel={
                query
                  ? "Clear search"
                  : userConnected?.role === "ADMIN"
                    ? "Add Event"
                    : undefined
              }
              onAction={
                query
                  ? () => setQuery("")
                  : userConnected?.role === "ADMIN"
                    ? () => setShowAddingPage(true)
                    : undefined
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {filterEvents.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <AddingEvent onCancel={() => setShowAddingPage(false)} />
      )}

      <Footer />
    </div>
  );
}

export default Events;
