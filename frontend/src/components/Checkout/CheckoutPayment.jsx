import React from "react";
import { CreditCard, Truck } from "lucide-react";

const CheckoutPayment = ({ paymentMethod, setPaymentMethod, setStep }) => {
  const methods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Pay securely online" },
    { id: "cod", label: "Cash on Delivery", icon: Truck, description: "Pay with cash at your door" },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-app-border shadow-xs space-y-6">
      <h3 className="text-sm font-semibold text-app-green">Select Payment Method</h3>
      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = paymentMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-app-orange bg-app-orange/5"
                  : "border-app-border bg-white hover:border-app-orange/30"
              }`}
            >
              <div className={`p-2 rounded-xl ${isSelected ? "bg-app-orange/10 text-app-orange" : "bg-app-cream text-app-text-light"}`}>
                <method.icon className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-app-green">{method.label}</p>
                <p className="text-xs text-app-text-light">{method.description}</p>
              </div>
              <div className={`size-4 rounded-full border flex items-center justify-center ${isSelected ? "border-app-orange" : "border-app-border"}`}>
                {isSelected && <div className="size-2 rounded-full bg-app-orange" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep("address")}
          className="flex-1 py-3 border border-app-border text-app-text-light font-semibold rounded-xl hover:bg-app-cream/30 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep("review")}
          className="flex-1 py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors shadow-xs"
        >
          Review Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPayment;