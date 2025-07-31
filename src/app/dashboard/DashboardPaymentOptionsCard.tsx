import { SquareButton } from "@/components/common/SquareButton";

export function DashboardPaymentOptionsCard() {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 pt-8">
      <h2 className="text-xl font-semibold text-gray-800 tracking-wide mb-6">Payment Options</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-700 uppercase tracking-wider">Drop-In Class</h3>
          <SquareButton href="#" variant="white">
            Drop-In
          </SquareButton>
        </div>
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-700 uppercase tracking-wider">Monthly Membership</h3>
          <SquareButton href="#" variant="navy">
            Subscribe
          </SquareButton>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-6">(Payment integration coming soon)</p>
    </div>
  );
}
