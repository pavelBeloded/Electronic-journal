import { notFound } from "next/navigation";

export default function Home() {
  notFound();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black"></div>
  );
}
