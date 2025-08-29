import { redirect } from "next/navigation";

export default function Home() {
  redirect("/overview");
  return <main className="bg-background grow"></main>;
}
