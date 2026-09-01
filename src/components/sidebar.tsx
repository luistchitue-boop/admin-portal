"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/teachers", label: "Teachers", icon: "◫" },
  { href: "/turmas", label: "Turmas", icon: "▤" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" aria-label="Livro">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 20.5z" />
              <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13a2 2 0 0 0-2 2v15a2 2 0 0 1 2-2h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
            </svg>
          </span>
          <span>
            ADMIN <small>CONTROL</small>
          </span>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={`sidebar-nav ${open ? "menu-open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={pathname === link.href ? "nav-active" : ""}
          >
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-2 rounded-xl border border-[#cbd8ce] bg-white px-3 py-2 text-left text-sm font-bold text-[#1d2b29]"
        >
          <span className="mr-2">↗</span> Logout
        </button>
      </nav>
    </aside>
  );
}
