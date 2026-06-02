"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/tests", label: "테스트 둘러보기" },
  { href: "/about", label: "오나 소개" },
  { href: "/faq", label: "자주 묻는 질문" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 라우트 바뀌면 메뉴 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100/60 bg-white/75 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
        <Link
          href="/"
          aria-label="OHNA 홈"
          className="flex items-center gap-2"
        >
          <span className="text-xl">✨</span>
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-base font-bold text-transparent">
            OHNA
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-700 transition hover:bg-gray-100"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 top-[57px] bottom-0 z-20 bg-black/30 backdrop-blur-sm"
              aria-hidden
            />
            <motion.nav
              key="nav-sheet"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-30 mx-auto max-w-md border-t border-violet-100/60 bg-white shadow-lg"
            >
              <ul className="py-2">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block px-5 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-gradient-to-r from-pink-50 to-violet-50 text-pink-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
