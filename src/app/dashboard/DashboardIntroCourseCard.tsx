import { Sparkles } from "lucide-react";
import { SquareButton } from "@/components/common/SquareButton";
import Link from "next/link";

export function DashboardIntroCourseCard() {
  return (
    <div className="bg-white border border-yellow-200 shadow-md rounded-lg p-6 pt-8 flex flex-col items-center text-center space-y-4">
      <h2 className="text-xl font-semibold text-yellow-700 flex items-center gap-2">
        <Sparkles className="text-yellow-500" size={24} />
        Let's Get Started
      </h2>
      <p className="text-gray-700">
        New to fencing? Start strong by signing up for one of our Intro Courses.
      </p>
      <SquareButton href="/intro-course" variant="medium-pink">
        ENROLL
      </SquareButton>
      <div className="border-t border-gray-200 w-full pt-4">
        <p className="text-gray-700 text-sm">
          Have previous experience?{" "}
          <Link
            href="/contact"
            className="underline text-yellow-700 hover:text-yellow-600 font-medium"
          >
            Contact us
          </Link>{" "}
          to get placed in the right class.
        </p>
      </div>
    </div>
  );
}
