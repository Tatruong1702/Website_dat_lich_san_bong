const PAYMENT_METHODS = [
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví điện tử MoMo",
    icon: "💜",
    badge: "Phổ biến",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    description: "Thanh toán qua ví ZaloPay",
    icon: "💙",
    badge: null,
    badgeColor: null,
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản trực tiếp qua tài khoản ngân hàng",
    icon: "🏦",
    badge: null,
    badgeColor: null,
  },
  {
    id: "credit_card",
    name: "Thẻ tín dụng / Ghi nợ",
    description: "Visa, Mastercard, JCB",
    icon: "💳",
    badge: null,
    badgeColor: null,
  },
  {
    id: "cod",
    name: "Thanh toán tại sân",
    description: "Trả tiền mặt khi đến sân",
    icon: "💵",
    badge: "Miễn phí",
    badgeColor: "bg-green-100 text-green-700",
  },
];

export default function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-gray-800 mb-4">Chọn phương thức thanh toán</h2>

      <div className="space-y-2.5">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              selected === method.id
                ? "border-orange-400 bg-orange-50"
                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            {/* Radio indicator */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected === method.id ? "border-orange-500" : "border-gray-300"
              }`}
            >
              {selected === method.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              )}
            </div>

            {/* Icon */}
            <span className="text-2xl leading-none">{method.icon}</span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-semibold ${selected === method.id ? "text-orange-700" : "text-gray-800"}`}>
                  {method.name}
                </span>
                {method.badge && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${method.badgeColor}`}>
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Security note */}
      <div className="mt-5 flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-gray-500">
          Thông tin thanh toán được mã hóa SSL 256-bit. Chúng tôi không lưu trữ thông tin thẻ của bạn.
        </p>
      </div>
    </div>
  );
}
