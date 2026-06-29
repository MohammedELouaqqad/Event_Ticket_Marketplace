import axios from "axios";
import { useState } from "react";
import { IoArrowBack, IoImageOutline } from "react-icons/io5";
import { type Event } from "../types/index";
import Button from "./ui/Button";
import Input from "./ui/Input";

type AddingEventProps = {
  onCancel?: () => void;
};

function AddingEvent({ onCancel }: AddingEventProps) {
  const [event, setEvent] = useState<Event>({
    name: "",
    description: "",
    date: "",
    price: 0,
    available_tickets: 0,
    location: "",
    fileName: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  var token = localStorage.getItem("token");

  async function createEvent(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const fetchAddingImage = async () => {
      try {
        const file = new FormData();
        const image = imageFile ?? event.fileName;
        if (image) file.append("image", image);
        const response = await axios.post(
          "http://localhost:8085/api/cloudinary/upload",
          file,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setEvent({ ...event, fileName: response.data.url });
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    await fetchAddingImage();
    console.log(event);
    const fetchAddingEvent = async () => {
      try {
        const response = await axios.post("http://localhost:8085/api/events", event, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status == 200) {
          alert("Event Added with Success");
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    };
    fetchAddingEvent();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-slide-up">
      {onCancel && (
        <button
          onClick={onCancel}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <IoArrowBack className="text-base" />
          Back to events
        </button>
      )}

      <form
        onSubmit={createEvent}
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-8">
          <h1 className="font-display text-2xl font-bold text-white">Create New Event</h1>
          <p className="mt-1 text-sm text-brand-200">
            List your event and start selling tickets
          </p>
        </div>

        <div className="space-y-5 p-8">
          <Input
            label="Event Name"
            placeholder="Summer Music Festival 2026"
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Tell attendees what makes this event special..."
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Event Date"
              type="date"
              value={event.date}
              onChange={(e) => setEvent({ ...event, date: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="Paris, France"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Price per Ticket ($)"
              type="number"
              min="0"
              placeholder="49"
              value={event.price || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEvent({ ...event, price: e.target.value as unknown as number })
              }
            />
            <Input
              label="Total Tickets Available"
              type="number"
              min="1"
              placeholder="500"
              value={event.available_tickets || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEvent({ ...event, available_tickets: e.target.value as unknown as number })
              }
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Event Image</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 sm:w-48">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <IoImageOutline className="text-3xl" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" loading={submitting} className="flex-1">
              Create Event
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddingEvent;
