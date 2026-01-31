const supabase = require('../config/supabase')

exports.addVehicle = async (req, res) => {
  try {
    const { owner_id, name, registration_number, allowed_passengers, rate_per_km } = req.body

    if (!owner_id || !name || !registration_number || !allowed_passengers || !rate_per_km) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if owner exists and role is owner
    const { data: owner } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', owner_id)
      .single()

    if (!owner || owner.role !== 'owner') {
      return res.status(403).json({ message: 'Only owners can add vehicles' })
    }

    const { error } = await supabase.from('vehicles').insert([
      {
        name,
        registration_number,
        allowed_passengers,
        rate_per_km,
        owner_id
      }
    ])

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({ message: 'Vehicle added successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
