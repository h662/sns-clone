import Link from "next/link";

const NotFound = () => {
  return (
    <div className="grow flex flex-col justify-center items-center">
      <h2 className="text-red-500">404 Not Found</h2>
      <button className="btn-style mt-2">
        <Link href="/">Return Home</Link>
      </button>
    </div>
  );
};

export default NotFound;
