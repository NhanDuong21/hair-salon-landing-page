"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { bookingReducer, dateLabel, demoDates, demoSlots } from "@/lib/booking";
import {
  services,
  stylists,
  priceLabel,
  type BookingPreset,
} from "@/lib/salon";
import { Arrow, Check, Close } from "./icons";
import { keepFocusVisible } from "./page-motion";

const BookingContext = createContext<(preset?: BookingPreset) => void>(
  () => {},
);
const SiteChromeContext = createContext<{
  menuOpen: boolean;
  bookingOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}>({ menuOpen: false, bookingOpen: false, setMenuOpen: () => {} });

export function useSiteChrome() {
  return useContext(SiteChromeContext);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<BookingPreset | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  function open(next: BookingPreset = {}) {
    opener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setPreset(next);
    setMenuOpen(false);
  }
  function close() {
    setPreset(null);
  }
  useEffect(() => {
    if (preset !== null || !opener.current) return;
    // Wait until React has removed the bar's inert attribute before focusing it.
    const frame = requestAnimationFrame(() => {
      const target = opener.current;
      if (target?.isConnected) {
        target.focus({ preventScroll: true });
        keepFocusVisible(target);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [preset]);
  return (
    <BookingContext value={open}>
      <SiteChromeContext value={{ menuOpen, setMenuOpen, bookingOpen: preset !== null }}>
      {children}
      {preset ? <BookingDialog preset={preset} onClose={close} /> : null}
      </SiteChromeContext>
    </BookingContext>
  );
}

export function BookingButton({
  children = "Đặt lịch",
  className = "button button-primary",
  serviceId,
  stylistId,
  arrow = true,
  id,
}: BookingPreset & {
  children?: ReactNode;
  className?: string;
  arrow?: boolean;
  id?: string;
}) {
  const open = useContext(BookingContext);
  return (
    <button
      type="button"
      id={id}
      className={className}
      onClick={() => open({ serviceId, stylistId })}
    >
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}

function BookingDialog({
  preset,
  onClose,
}: {
  preset: BookingPreset;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const closeAnimation = useRef<Animation | null>(null);
  const [isClosing, setClosing] = useState(false);
  const [dates] = useState(() => demoDates());
  const [state, dispatch] = useReducer(bookingReducer, {
    serviceId: preset.serviceId ?? "",
    stylistId: preset.stylistId ?? "any",
    date: dates[0],
    time: "",
    step: 1,
  });
  const service = services.find((s) => s.id === state.serviceId);
  const stylist = stylists.find((s) => s.id === state.stylistId);
  const slots = state.serviceId
    ? demoSlots(state.serviceId, state.stylistId, state.date)
    : [];
  const titles = [
    "Chọn dịch vụ cho mái tóc",
    "Chọn người & thời gian",
    "Lịch hẹn mẫu của bạn",
  ];
  function closeDialog() {
    const el = dialog.current;
    if (!el || closing.current) return;
    closing.current = true;
    setClosing(true);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.getAnimations().forEach((animation) => animation.cancel());
    closeAnimation.current = el.animate(
      [{ opacity: 1, transform: "none" }, { opacity: 0, transform: reduce ? "none" : "translateY(8px) scale(.99)" }],
      { duration: reduce ? 80 : 160, easing: "ease-out", fill: "forwards" },
    );
    void closeAnimation.current.finished.then(() => {
      // Release native inertness before restoring focus to the opener.
      el.close();
      onClose();
    }).catch(() => {});
  }

  useEffect(() => {
    const el = dialog.current!;
    const originalOverflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      closeAnimation.current?.cancel();
      el.close();
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  useEffect(() => {
    content.current?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [state.step]);

  return (
    <dialog
      ref={dialog}
      className="booking-dialog"
      data-closing={isClosing}
      aria-labelledby="booking-title"
      aria-describedby="booking-note"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const root = event.currentTarget;
        const candidates = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
          ),
        );
        const focusable = candidates.filter((element) => {
          if (
            !(element instanceof HTMLInputElement) ||
            element.type !== "radio"
          )
            return true;
          const group = candidates.filter(
            (candidate) =>
              candidate instanceof HTMLInputElement &&
              candidate.name === element.name,
          ) as HTMLInputElement[];
          return element === (group.find((radio) => radio.checked) ?? group[0]);
        });
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            closeDialog();
        }
      }}
    >
      <div className="dialog-shell">
        <header className="dialog-header">
          <div className="dialog-brand">
            <span className="wordmark">Sol.</span>
            <span>Đặt lịch demo</span>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Đóng đặt lịch"
            onClick={closeDialog}
          >
            <Close />
          </button>
        </header>
        <ol className="booking-progress" aria-label="Tiến trình đặt lịch">
          {["Dịch vụ", "Người & giờ", "Xem lại"].map((label, index) => (
            <li
              key={label}
              className={state.step >= index + 1 ? "current" : ""}
              aria-current={state.step === index + 1 ? "step" : undefined}
            >
              <span>{state.step > index + 1 ? <Check /> : index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <div className="dialog-content" ref={content} key={state.step}>
          <h2 id="booking-title" ref={heading} tabIndex={-1}>
            {titles[state.step - 1]}
          </h2>
          <p id="booking-note" className="demo-note">
            Lịch mẫu — không phải thời gian trống thực tế
          </p>
          {state.step === 1 ? (
            <fieldset className="booking-services">
              <legend className="sr-only">Chọn một dịch vụ</legend>
              {services.map((item) => (
                <label className="service-option" key={item.id}>
                  <input
                    type="radio"
                    name="booking-service"
                    value={item.id}
                    checked={state.serviceId === item.id}
                    onChange={() =>
                      dispatch({ type: "service", value: item.id })
                    }
                  />
                  <span className="service-option-copy">
                    <strong>{item.name}</strong>
                    <span>{item.duration} phút</span>
                  </span>
                  <span className="option-price">{priceLabel(item)}</span>
                </label>
              ))}
              <p className="field-hint">
                Giá và thời lượng mang tính minh họa. Giá “từ” còn tùy độ dài và
                nền tóc.
              </p>
            </fieldset>
          ) : null}
          {state.step === 2 ? (
            <div className="schedule-fields">
              <p className="chosen-service">
                <span>{service?.name}</span>
                <strong>
                  {service ? priceLabel(service) : ""}{" "}
                  <span>· {service?.duration} phút</span>
                </strong>
              </p>
              <fieldset>
                <legend>Người thực hiện</legend>
                <div className="stylist-options">
                  <label className="choice any-stylist">
                    <input
                      type="radio"
                      name="booking-stylist"
                      checked={state.stylistId === "any"}
                      onChange={() =>
                        dispatch({ type: "stylist", value: "any" })
                      }
                    />
                    <span>Để salon sắp xếp</span>
                  </label>
                  {stylists.map((item) => (
                    <label className="choice" key={item.id}>
                      <input
                        type="radio"
                        name="booking-stylist"
                        checked={state.stylistId === item.id}
                        onChange={() =>
                          dispatch({ type: "stylist", value: item.id })
                        }
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Ngày hẹn mẫu</legend>
                <div className="date-options">
                  {dates.map((date) => (
                    <label className="choice date-choice" key={date}>
                      <input
                        type="radio"
                        name="booking-date"
                        checked={state.date === date}
                        onChange={() => dispatch({ type: "date", value: date })}
                      />
                      <span>{dateLabel(date, true)}</span>
                    </label>
                  ))}
                </div>
                <p className="field-hint">
                  Giờ Việt Nam (GMT+7) · Ngày luôn được cập nhật khi mở demo.
                </p>
              </fieldset>
              <fieldset>
                <legend>
                  Giờ hẹn mẫu{" "}
                  <span className="unavailable-legend">
                    Ô mờ: không khả dụng
                  </span>
                </legend>
                <div className="time-options">
                  {slots.map((slot) => (
                    <label
                      className={`choice time-choice ${slot.available ? "" : "unavailable"}`}
                      key={slot.time}
                    >
                      <input
                        type="radio"
                        name="booking-time"
                        checked={state.time === slot.time}
                        disabled={!slot.available}
                        aria-label={`${slot.time}${slot.available ? "" : " — không khả dụng"}`}
                        onChange={() =>
                          dispatch({ type: "time", value: slot.time })
                        }
                      />
                      <span>{slot.time}</span>
                    </label>
                  ))}
                </div>
                <p className="field-hint" aria-live="polite">
                  {state.time
                    ? `Đã chọn ${state.time}. Bạn có thể xem lại lựa chọn.`
                    : "Chọn một giờ còn sáng để tiếp tục."}
                </p>
              </fieldset>
            </div>
          ) : null}
          {state.step === 3 && service ? (
            <div className="booking-review">
              <div className="review-intro">
                <Check />
                <span>Bạn đã chọn xong thông tin mẫu.</span>
              </div>
              <dl className="review-list">
                <div>
                  <dt>Dịch vụ</dt>
                  <dd>{service.name}</dd>
                </div>
                <div>
                  <dt>Người thực hiện</dt>
                  <dd>{stylist?.name ?? "Để salon sắp xếp"}</dd>
                </div>
                <div>
                  <dt>Ngày</dt>
                  <dd>{dateLabel(state.date)}</dd>
                </div>
                <div>
                  <dt>Giờ bắt đầu</dt>
                  <dd>
                    {state.time} <span>(giờ Việt Nam)</span>
                  </dd>
                </div>
                <div>
                  <dt>Thời lượng dự kiến</dt>
                  <dd>{service.duration} phút</dd>
                </div>
                <div className="review-price">
                  <dt>{service.from ? "Giá khởi điểm" : "Giá dịch vụ"}</dt>
                  <dd>{priceLabel(service)}</dd>
                </div>
              </dl>
              {service.from ? (
                <p className="field-hint">
                  Giá thực tế cần được trao đổi theo độ dài, nền tóc và kỹ thuật
                  trước khi thực hiện.
                </p>
              ) : null}
              <div className="demo-disclaimer">
                <strong>
                  Đây là trải nghiệm demo.
                  <br />
                  Chưa có lịch hẹn nào được tạo.
                </strong>
                <p>
                  Thông tin chỉ hiển thị trong lần xem này. Sol không thu thập
                  thông tin cá nhân hay giữ chỗ.
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <footer className="dialog-footer">
          {state.step > 1 ? (
            <button
              type="button"
              className="back-button"
              onClick={() =>
                dispatch({ type: "step", value: state.step === 3 ? 2 : 1 })
              }
            >
              Quay lại
            </button>
          ) : (
            <span className="footer-hint">Chọn 1 dịch vụ</span>
          )}
          {state.step < 3 ? (
            <button
              type="button"
              className="button button-primary"
              disabled={state.step === 1 ? !service : !state.time}
              onClick={() =>
                dispatch({ type: "step", value: state.step === 1 ? 2 : 3 })
              }
            >
              {state.step === 1 ? "Chọn người & giờ" : "Xem lại lựa chọn"}
              <Arrow />
            </button>
          ) : (
            <button
              type="button"
              className="button button-primary"
              onClick={closeDialog}
            >
              Đóng demo
              <Close width="18" height="18" />
            </button>
          )}
        </footer>
      </div>
    </dialog>
  );
}

export function MobileBookingBar() {
  const { menuOpen, bookingOpen } = useSiteChrome();
  const [pastHero, setPastHero] = useState(false);
  const [atFinal, setAtFinal] = useState(false);
  const visible = pastHero && !atFinal && !menuOpen && !bookingOpen;
  useEffect(() => {
    const hero = document.getElementById("hero-booking");
    const final = document.getElementById("dat-lich");
    if (!hero || !final) return;
    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.bottom <= 76);
    }, { rootMargin: "-76px 0px 0px" });
    const finalObserver = new IntersectionObserver(([entry]) => setAtFinal(entry.isIntersecting), {
      rootMargin: "0px 0px 76px",
    });
    heroObserver.observe(hero);
    finalObserver.observe(final);
    return () => { heroObserver.disconnect(); finalObserver.disconnect(); };
  }, []);
  useEffect(() => {
    if (visible) keepFocusVisible(document.activeElement);
  }, [visible]);
  return (
    <div className="mobile-booking-bar" data-visible={visible} inert={!visible} aria-hidden={!visible}>
      <span>Lịch hẹn mẫu tại Sol</span>
      <BookingButton arrow={false} />
    </div>
  );
}
