import { services, type ServiceId, type StylistId } from "./salon";

const zone = "Asia/Ho_Chi_Minh";
export function demoDates(now = new Date()): string[] {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (key: string) =>
    Number(parts.find((p) => p.type === key)?.value);
  const today = Date.UTC(part("year"), part("month") - 1, part("day"));
  return Array.from({ length: 5 }, (_, i) =>
    new Date(today + (i + 1) * 86400000).toISOString().slice(0, 10),
  );
}
export function dateLabel(date: string, short = false): string {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: zone,
    weekday: short ? "short" : "long",
    day: "2-digit",
    month: "2-digit",
    ...(short ? {} : { year: "numeric" }),
  }).format(new Date(`${date}T12:00:00+07:00`));
}

// A deterministic display fixture, not a real availability/overlap scheduler.
export function demoSlots(
  serviceId: ServiceId,
  stylistId: StylistId,
  date: string,
) {
  const duration = services.find((s) => s.id === serviceId)!.duration;
  const times = [
    "09:00",
    "10:30",
    "12:00",
    "13:30",
    "15:00",
    "16:30",
    "18:00",
    "19:00",
  ];
  const seed = [...`${serviceId}${stylistId}${date}`].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return times.map((time, index) => {
    const [h, m] = time.split(":").map(Number);
    return {
      time,
      available: h * 60 + m + duration <= 20 * 60 && (seed + index) % 3 !== 0,
    };
  });
}

export type BookingState = {
  serviceId: ServiceId | "";
  stylistId: StylistId;
  date: string;
  time: string;
  step: 1 | 2 | 3;
};
export type BookingAction =
  | { type: "service"; value: ServiceId }
  | { type: "stylist"; value: StylistId }
  | { type: "date"; value: string }
  | { type: "time"; value: string }
  | { type: "step"; value: 1 | 2 | 3 };
export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "service":
      return { ...state, serviceId: action.value, time: "" };
    case "stylist":
      return { ...state, stylistId: action.value, time: "" };
    case "date":
      return { ...state, date: action.value, time: "" };
    case "time":
      return state.serviceId &&
        demoSlots(state.serviceId, state.stylistId, state.date).some(
          (s) => s.time === action.value && s.available,
        )
        ? { ...state, time: action.value }
        : state;
    case "step":
      return action.value === 1 ||
        (state.serviceId &&
          (action.value === 2 ||
            (state.date &&
              state.time &&
              demoSlots(state.serviceId, state.stylistId, state.date).some(
                (s) => s.time === state.time && s.available,
              ))))
        ? { ...state, step: action.value }
        : state;
  }
}
