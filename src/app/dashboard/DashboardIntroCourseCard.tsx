import { AlertCircle } from "lucide-react";
import { SquareButton } from "@/components/common/SquareButton";

export function DashboardIntroCourseCard() {
  return (
    <div className="bg-white border border-yellow-300 shadow-md rounded-lg p-6 pt-8 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
        <AlertCircle className="text-yellow-500" size={24} />
        Complete Your Intro Course
      </h2>
      <p className="text-gray-700 mb-4">You must complete our Intro Course before you can pay for classes or sign up for membership.</p>
      <SquareButton href="#" variant="medium-pink" disabled>
        Enroll
      </SquareButton>
    </div>
  );
}
