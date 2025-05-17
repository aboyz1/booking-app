import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// POST /api/tickets/verify
router.post('/verify', async (req, res) => {
  const { ticketCode } = req.body;

  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        route:routes(
          *,
          origin:stations!routes_origin_id_fkey(*),
          destination:stations!routes_destination_id_fkey(*)
        ),
        bus:buses(*),
        booking_seats(*),
        booking_luggage(
          *,
          luggage_type:luggage_types(*)
        )
      `)
      .eq('ticket_code', ticketCode)
      .single();

    if (error) throw error;

    if (!booking) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;