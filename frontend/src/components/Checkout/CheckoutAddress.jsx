import React from "react";
import { MapPinIcon } from "lucide-react";

const CheckoutAddress = ({ address, setAddress, setStep, user }) => {
  const handleSelectSaved = (addr) => {
    setAddress({
      id: addr.id,
      label: addr.label,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault,
      lat: addr.lat || 0,
      lng: addr.lng || 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = address.address && address.city && address.state && address.zip;

  return (
    <div className="space-y-6">
      {/* Direcciones Guardadas del Usuario */}
      {user?.addresses?.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-app-border shadow-xs">
          <h3 className="text-sm font-semibold text-app-green mb-3">Saved Addresses</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {user.addresses.map((addr) => {
              const isSelected = address.id === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSaved(addr)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-app-green bg-app-green/5"
                      : "border-app-border bg-white hover:border-app-green/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPinIcon className={`size-4 ${isSelected ? "text-app-green" : "text-app-text-light"}`} />
                    <span className="text-sm font-semibold text-app-green">{addr.label}</span>
                  </div>
                  <p className="text-xs text-app-text-light truncate">{addr.address}</p>
                  <p className="text-xs text-app-text-light">
                    {addr.city}, {addr.state}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulario Manual Integrado */}
      <div className="bg-white p-5 rounded-2xl border border-app-border shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-app-green">Shipping Details</h3>
        <div>
          <label className="block text-xs font-semibold text-app-text-light mb-1 uppercase tracking-wider">Street Address</label>
          <input
            type="text"
            name="address"
            value={address.address || ""}
            onChange={handleInputChange}
            placeholder="123 Taco Avenue"
            className="w-full px-4 py-2.5 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-app-green bg-app-cream/10"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-app-text-light mb-1 uppercase tracking-wider">City</label>
            <input
              type="text"
              name="city"
              value={address.city || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-app-green bg-app-cream/10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-app-text-light mb-1 uppercase tracking-wider">State</label>
            <input
              type="text"
              name="state"
              value={address.state || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-app-green bg-app-cream/10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-app-text-light mb-1 uppercase tracking-wider">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={address.zip || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-app-green bg-app-cream/10"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!isFormValid}
        onClick={() => setStep("payment")}
        className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckoutAddress;