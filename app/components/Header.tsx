"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";

const Header: FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex justify-end px-4 py-2">
        <button className="btn-style" onClick={() => signIn()}>
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-between px-4 py-2">
      <div className="truncate">Hello, {session.user?.name}</div>
      <div className="flex items-center">
        <button className="btn-style">
          <Link href="/">Home</Link>
        </button>
        <button className="btn-style ml-2">
          <Link href="/create">Create</Link>
        </button>
        <button className="btn-style ml-2">
          <Link href="/profile">Profile</Link>
        </button>
        <button className="btn-style ml-2 truncate" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;
