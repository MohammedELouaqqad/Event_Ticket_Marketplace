import { useState } from "react";
import { CiLocationOn, CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import { type Event } from "../types/index";
import { formatDate, formatPrice } from "../lib/utils";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

type EventCardProps = {
  event: Event;
};

function EventCard({ event }: EventCardProps) {
  const [cardTickets, setCardTickets] = useState({});
  const [oneEvent] = useState(event);
  const [added, setAdded] = useState(false);

  function addingToCart(eventToCard: Event) {
    setCardTickets(eventToCard);
    console.log(cardTickets);
    localStorage.setItem("events", JSON.stringify(eventToCard));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const lowStock =
    oneEvent.available_tickets != null && oneEvent.available_tickets < 10;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {oneEvent.fileName ? (
          <img
            src={oneEvent.fileName}
            loading="lazy"
            alt={oneEvent.name || "Event"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
            <IoTicketOutline className="text-5xl text-brand-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-3 top-3">
          <Badge variant="price">{formatPrice(oneEvent.price)}</Badge>
        </div>
        {lowStock && (
          <div className="absolute left-3 top-3">
            <Badge variant="warning">{oneEvent.available_tickets} left</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg font-semibold leading-snug text-slate-900 line-clamp-2">
          {oneEvent.name}
        </h2>

        <div className="mt-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <CiLocationOn className="shrink-0 text-base text-brand-500" aria-hidden="true" />
            <span className="truncate">{oneEvent.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <CiCalendarDate className="shrink-0 text-base text-brand-500" aria-hidden="true" />
            <span>{formatDate(oneEvent.date)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <IoTicketOutline className="shrink-0 text-base text-brand-500" aria-hidden="true" />
            <span>{oneEvent.available_tickets} tickets available</span>
          </div>
        </div>

        {oneEvent.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-400 line-clamp-2">
            {oneEvent.description}
          </p>
        )}

        <Button
          onClick={() => addingToCart(oneEvent)}
          className="mt-auto pt-5 w-full"
          variant={added ? "secondary" : "primary"}
        >
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
}

export default EventCard;
