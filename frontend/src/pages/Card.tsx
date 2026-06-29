import { useContext, useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/layout/Footer";
import EmptyState from "../Components/ui/EmptyState";
import Button from "../Components/ui/Button";
import Badge from "../Components/ui/Badge";
import { CiLocationOn } from "react-icons/ci";
import { IoTicketOutline, IoCartOutline, IoRemove, IoAdd } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { type Event, type Order } from "../types/index";
import { UserContext } from "../context/UserContext";
import { formatPrice, cn, getApiErrorMessage } from "../lib/utils";

function Card() {
  const [ticket, setTicket] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]=useState("")

  const context = useContext(UserContext);
  if (!context) return null;

  const { userConnected } = context;

  const [order, setOrder] = useState<Order>({
    event: {},
    user: { id: userConnected?.id },
    totalPrice: 0,
    quantity: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Object.keys(parsed).length > 0) {
          setTicket(parsed);
        }
      } catch {
        setTicket(null);
      }
    }
  }, []);

  useEffect(() => {
    if (ticket) {
      console.log(ticket);
      setOrder({ ...order, event: ticket });
    }
  }, [ticket]);

  console.log(order);

  function handleAddQuantity(eventId: number) {
    setOrder((t: Order) => {
      console.log(t);
      if (t.event.id === eventId) {
        return { ...t, quantity: t.quantity + 1 };
      } else {
        return t;
      }
    });
    localStorage.setItem("orders", JSON.stringify(order));
  }

  function handleMinusQuantity(eventId: number) {
    setOrder((t) => {
      if (t.event.id === eventId && t.quantity > 1) {
        return { ...t, quantity: t.quantity - 1 };
      } else {
        return t;
      }
    });
    localStorage.setItem("orders", JSON.stringify(order));
  }

  function handleRemoveTicket() {
    setTicket(null);
    setOrder({ event: {}, user: { id: userConnected?.id }, totalPrice: 0, quantity: 1 });
    localStorage.setItem("events", JSON.stringify({}));
    localStorage.setItem("orders", JSON.stringify({}));
  }

  var token = localStorage.getItem("token");

  useEffect(() => {
    console.log(userConnected);
  }, [userConnected]);

  async function handleAddingOrder() {
    if(!token || !userConnected?.id ||!order.event?.id){
      setError("Session invalide. Reconnectez-vous.");
      return;
    }
    setSubmitting(true);
    setError("")
   
      try {
        const payload: Order = {
          event: order.event,
          user: {id : userConnected.id},
          quantity: order.quantity,
          totalPrice: 0,
        }
        const orderRes = await axios.post(
          "http://localhost:8085/api/orders",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const savedOrder = orderRes.data;

        if (!savedOrder?.id) {
          setError("Order was not saved correctly. Missing order id.");
          return;
        }

        const paymentRes = await axios.post(
          "http://localhost:8085/api/addingPayment",
          savedOrder,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const stripeUrl = paymentRes.data;

        if (!stripeUrl || typeof stripeUrl !== "string") {
          setError("Invalid Stripe checkout URL received.");
          return;
        }

        localStorage.removeItem("events");
        localStorage.removeItem("orders");
        window.location.href = stripeUrl;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(getApiErrorMessage(error.response?.data, "Payment failed. Please try again."));
          console.error("Payment error:", error.response?.status, error.response?.data);
        } else {
          setError("Payment failed. Please try again.");
        }
        console.log(error);
      } finally {
        setSubmitting(false);
      }


  }
  

  const subtotal = (order.event.price ?? 0) * order.quantity;
  const serviceFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + serviceFee;
  const hasTicket = ticket !== null && ticket.name;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-slate-900">Your Cart</h1>
          <p className="mt-2 text-slate-500">Review your tickets before checkout</p>
        </div>

        {hasTicket ? (
          <div className="grid gap-8 lg:grid-cols-3 animate-fade-in">
            {/* Cart item */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  {/* Event image */}
                  <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
                    {order.event.fileName ? (
                      <img
                        src={order.event.fileName}
                        alt={order.event.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
                        <IoTicketOutline className="text-3xl text-brand-400" />
                      </div>
                    )}
                  </div>

                  {/* Event details */}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-semibold text-slate-900">
                        {order.event.name}
                      </h2>
                      <Badge variant="price">{formatPrice(order.event.price)}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CiLocationOn className="shrink-0 text-brand-500" />
                      <span>{order.event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <IoTicketOutline className="shrink-0 text-brand-500" />
                      <span>{order.event.available_tickets} tickets available</span>
                    </div>

                    {/* Quantity + remove */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600">Quantity</span>
                        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <button
                            onClick={() => handleMinusQuantity(order.event.id!)}
                            disabled={order.quantity <= 1}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              order.quantity <= 1
                                ? "cursor-not-allowed text-slate-300"
                                : "text-slate-600 hover:bg-white hover:shadow-sm"
                            )}
                            aria-label="Decrease quantity"
                          >
                            <IoRemove />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-900">
                            {order.quantity}
                          </span>
                          <button
                            onClick={() => handleAddQuantity(order.event.id!)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:shadow-sm"
                            aria-label="Increase quantity"
                          >
                            <IoAdd />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleRemoveTicket}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                      >
                        <MdDeleteOutline className="text-lg" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-3 border-b border-slate-100 pb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      {formatPrice(order.event.price)} × {order.quantity}
                    </span>
                    <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service fee</span>
                    <span className="font-medium text-slate-900">{formatPrice(serviceFee)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="font-display font-semibold text-slate-900">Total</span>
                  <span className="font-display text-xl font-bold text-brand-600">
                    {formatPrice(total)}
                  </span>
                </div>

                {error && (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleAddingOrder}
                  loading={submitting}
                  className="mt-6 w-full"
                  size="lg"
                >
                  Proceed to Payment
                </Button>

                <button
                  onClick={() => navigate("/events")}
                  className="mt-3 w-full text-center text-sm text-slate-500 transition-colors hover:text-brand-600"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<IoCartOutline className="text-3xl" />}
            title="Your cart is empty"
            description="Browse events and add tickets to your cart to get started."
            actionLabel="Browse Events"
            onAction={() => navigate("/events")}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Card;
