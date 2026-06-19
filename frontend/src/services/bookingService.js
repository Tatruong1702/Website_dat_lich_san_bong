const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
  }
  return data;
}

// ---------- Courts ----------

export async function getCourtById(courtId) {
  return request(`/courts/${courtId}`);
}

export async function getAvailableSlots(courtId, date) {
  return request(`/courts/${courtId}/slots?date=${date}`);
}

// ---------- Bookings ----------

/**
 * Create a new booking (status = pending)
 * @param {{ court_id, booking_date, start_time, end_time, total_price, promo_code }} payload
 */
export async function createBooking(payload) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(bookingId) {
  return request(`/bookings/${bookingId}`);
}

/**
 * Get all bookings for the current user
 */
export async function getUserBookings() {
  return request("/bookings/me");
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId) {
  return request(`/bookings/${bookingId}/cancel`, { method: "PATCH" });
}

// ---------- Payments ----------

/**
 * Initiate payment for a booking
 * Returns { payment_id, redirect_url? } for redirect-based methods
 * @param {{ booking_id, payment_method, amount }} payload
 */
export async function createPayment(payload) {
  return request("/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Verify/poll payment status after callback
 */
export async function verifyPayment(paymentId) {
  return request(`/payments/${paymentId}/verify`);
}

// ---------- Promotions ----------

/**
 * Validate a promo code and return discount info
 */
export async function validatePromoCode(code, subtotal) {
  return request(`/promotions/validate`, {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}
