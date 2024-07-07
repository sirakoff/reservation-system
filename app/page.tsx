import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import TimeTable from "@/components/TimeTable";
const supabase = createClient();

export default async function ProtectedPage() {
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
