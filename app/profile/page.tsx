"use client";

import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Profile: NextPage = () => {
  const [name, setName] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  const onSubmitChangeName = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!name || session?.user.name === name) return;

      await axios.put(`http://${window.location.host}/api/user/name`, {
        name,
      });

      signOut();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }

    setName(session?.user?.name || "anonymous");
  }, [session]);

  return (
    <div className="grow flex flex-col justify-center items-center">
      <form onSubmit={onSubmitChangeName}>
        <label>Name:</label>
        <input
          className="input-style ml-2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input className="btn-style ml-2" type="submit" value="Change" />
      </form>
    </div>
  );
};

export default Profile;
