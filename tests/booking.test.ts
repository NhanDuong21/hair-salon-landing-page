import test from "node:test";
import assert from "node:assert/strict";
import {
  bookingReducer,
  demoDates,
  demoSlots,
  type BookingState,
} from "../lib/booking";
import { services, stylists } from "../lib/salon";

const initial: BookingState = {
  serviceId: "",
  stylistId: "any",
  date: "2026-09-08",
  time: "",
  step: 1,
};
test("dates start tomorrow in Vietnam, including year rollover", () => {
  assert.deepEqual(demoDates(new Date("2026-12-31T16:59:00Z")), [
    "2027-01-01",
    "2027-01-02",
    "2027-01-03",
    "2027-01-04",
    "2027-01-05",
  ]);
  assert.equal(demoDates(new Date("2026-12-31T17:01:00Z"))[0], "2027-01-02");
});
test("dates handle leap day and month rollover", () => {
  assert.equal(demoDates(new Date("2028-02-28T12:00:00Z"))[0], "2028-02-29");
  assert.equal(demoDates(new Date("2028-02-29T12:00:00Z"))[0], "2028-03-01");
});
test("cannot skip a required service or time", () => {
  assert.equal(bookingReducer(initial, { type: "step", value: 2 }).step, 1);
  assert.equal(
    bookingReducer(
      { ...initial, serviceId: "cut", step: 2 },
      { type: "step", value: 3 },
    ).step,
    2,
  );
});
test("fixture offers both enabled and unavailable slots for every service/stylist", () => {
  for (const service of services)
    for (const stylist of ["any", ...stylists.map((s) => s.id)] as const)
      for (const date of demoDates(new Date("2026-09-07T12:00:00Z"))) {
        const slots = demoSlots(service.id, stylist, date);
        assert.ok(slots.some((s) => s.available));
        assert.ok(slots.some((s) => !s.available));
        for (const slot of slots.filter((s) => s.available)) {
          const [h, m] = slot.time.split(":").map(Number);
          assert.ok(h * 60 + m + service.duration <= 1200);
        }
      }
});
test("unavailable and unknown slots cannot be selected", () => {
  const state = { ...initial, serviceId: "perm" as const, step: 2 as const };
  const unavailable = demoSlots("perm", "any", state.date).find(
    (s) => !s.available,
  )!;
  assert.equal(
    bookingReducer(state, { type: "time", value: unavailable.time }).time,
    "",
  );
  assert.equal(
    bookingReducer(state, { type: "time", value: "23:59" }).time,
    "",
  );
});
test("changing service, person or date clears previously selected time", () => {
  const state: BookingState = {
    ...initial,
    serviceId: "cut",
    stylistId: "an",
    time: "10:30",
    step: 2,
  };
  assert.equal(
    bookingReducer(state, { type: "service", value: "perm" }).time,
    "",
  );
  assert.equal(
    bookingReducer(state, { type: "stylist", value: "linh" }).time,
    "",
  );
  assert.equal(
    bookingReducer(state, { type: "date", value: "2026-09-09" }).time,
    "",
  );
});
test("complete valid flow, review, back and edit", () => {
  let state = bookingReducer(initial, { type: "service", value: "color" });
  state = bookingReducer(state, { type: "step", value: 2 });
  state = bookingReducer(state, { type: "stylist", value: "linh" });
  const slot = demoSlots("color", "linh", state.date).find((s) => s.available)!;
  state = bookingReducer(state, { type: "time", value: slot.time });
  state = bookingReducer(state, { type: "step", value: 3 });
  assert.equal(state.step, 3);
  assert.equal(state.time, slot.time);
  state = bookingReducer(state, { type: "step", value: 2 });
  assert.equal(state.time, slot.time);
  state = bookingReducer(state, { type: "step", value: 1 });
  state = bookingReducer(state, { type: "service", value: "wash" });
  assert.equal(state.stylistId, "linh");
  assert.equal(state.time, "");
});
