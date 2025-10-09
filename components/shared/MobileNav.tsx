"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
          priority
          className="w-48 h-auto"
        />
      </Link>
      <nav className="flex gap-2">
        <SignedIn>
          <UserButton />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <SheetTitle>
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="logo"
                  width={152}
                  height={23}
                  priority
                  className="m-4"
                />
              </SheetTitle>

              <SheetDescription className="sr-only">
                Navigation drawer containing links to main pages
              </SheetDescription>

              <ul className="header-nav_elements">
                {navLinks.map((link) => {
                  const isActive = link.route === pathname;
                  return (
                    <li
                      key={link.route}
                      className={`${
                        isActive && "gradient-text"
                      } flex whitespace-nowrap text-dark-700`}
                    >
                      <Link
                        className="sidebar-link cursor-pointer"
                        href={link.route}
                        onClick={() => setOpen(false)}
                      >
                        <Image
                          src={link.icon}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </SignedIn>
      </nav>
    </header>
  );
};

export default MobileNav;
