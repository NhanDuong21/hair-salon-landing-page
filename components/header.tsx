"use client";

import { useEffect, useRef } from "react";
import { BookingButton, useSiteChrome } from "./booking";
import { Close } from "./icons";
import { MotionToggle } from "./motion-director";

const links = [
  ["#dich-vu", "Dịch vụ & giá"],
  ["#doi-ngu", "Đội ngũ"],
  ["#khong-gian", "Không gian"],
  ["#lien-he", "Liên hệ"],
];
export function Header() {
  const { menuOpen: open, setMenuOpen: setOpen } = useSiteChrome();
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus({ preventScroll: true });
      }
    }
    const desktop = matchMedia("(min-width: 900px)");
    function resize() {
      if (desktop.matches) setOpen(false);
    }
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [open, setOpen]);
  return (
    <header className="site-header" data-menu-open={open}>
      <div className="container header-inner">
        <a
          href="#dau-trang"
          className="brand"
          translate="no"
          aria-label="Sol. Hair Studio — về đầu trang"
        >
          <span className="wordmark">
            Sol<span className="wordmark-dot">.</span>
          </span>
          <span className="brand-label">HAIR STUDIO</span>
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <MotionToggle />
          <BookingButton
            className="button button-primary header-booking"
            arrow={false}
          />
          <button
            type="button"
            className="icon-button menu-toggle"
            ref={button}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <Close />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Điều hướng mobile"
          hidden={!open}
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => {
                setOpen(false);
                document
                  .getElementById(href.slice(1))
                  ?.focus({ preventScroll: true });
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
