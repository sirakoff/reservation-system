// @ts-ignore

import { createClient } from "@/utils/supabase/server";
// @ts-ignore

import Header from "@/components/Header";
import { redirect } from "next/navigation";
// @ts-ignore

import TimeTable from "@/components/TimeTable";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user main app: ", user);

  if (!user) {
    return redirect("/auth");
  }

  return (
    <div className="w-full">
      <Header />

      <div className="w-full max-w-4xl h-full max-h-10 mx-auto mt-10">
        <p className="my-5 text-center font-bold	">
          Click on an available slot to reserve it.
        </p>
        <TimeTable user={user} />
      </div>
    </div>
  );
}
