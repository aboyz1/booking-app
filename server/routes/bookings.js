import express from 'express';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper function to generate ticket code
const generateTicketCode = (origin, destination, date) => {
  const originCode = origin.substring(0, 3).toUpperCase();
  const destCode = destination.substring(0, 3).toUpperCase();
  const dateCode = date.replace(/-/g, '').substring(4, 8);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${originCode}-${destCode}-${dateCode}-${randomStr}`;
};

// Helper function to generate QR code
const generateQRCode = async (ticketCode) => {
  try {
    return await QRCode.toDataURL(ticketCode);
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};

// POST /api/bookings
router.post('/', async (req, res) => {
  const {
    userId,
    routeId,
    busId,
    departureDate,
    departureTime,
    seats,
    luggage,
    totalPrice
  } = req.body;

  try {
    // Get route info for ticket code
    const { data: route } = await supabase
      .from('routes')
      .select(`
        *,
        origin:stations!routes_origin_id_fkey(city),
        destination:stations!routes_destination_id_fkey(city)
      `)
      .eq('id', routeId)
      .single();

    const ticketCode = generateTicketCode(
      route.origin.city,
      route.destination.city,
      departureDate
    );

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        route_id: routeId,
        bus_id: busId,
        departure_date: departureDate,
        departure_time: departureTime,
        total_price: totalPrice,
        status: 'confirmed',
        ticket_code: ticketCode
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Insert seats
    if (seats.length > 0) {
      const { error: seatsError } = await supabase
        .from('booking_seats')
        .insert(
          seats.map(seat => ({
            booking_id: booking.id,
            seat_number: seat.number,
            price: seat.price
          }))
        );
      if (seatsError) throw seatsError;
    }

    // Insert luggage
    if (luggage.length > 0) {
      const { error: luggageError } = await supabase
        .from('booking_luggage')
        .insert(
          luggage.map(item => ({
            booking_id: booking.id,
            luggage_type_id: item.type.id,
            quantity: item.quantity,
            weight: item.weight,
            description: item.description,
            image_url: item.imageUrl
          }))
        );
      if (luggageError) throw luggageError;
    }

    // Generate QR code
    const qrCode = await generateQRCode(ticketCode);

    res.json({
      ...booking,
      qrCode,
      seats,
      luggage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;