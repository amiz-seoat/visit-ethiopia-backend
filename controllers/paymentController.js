import axios from 'axios'

// Initialize Payment
export const initializePayment = async (req, res) => {
  try {
    const { amount, email, firstName, lastName } = req.body

    const tx_ref = `tx-${Date.now()}`

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency: 'ETB',
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref,
        callback_url: process.env.CHAPA_CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.status(200).json({
      message: response.data.message,
      status: response.data.status,
      data: response.data.data,
      tx_ref,
    })
  } catch (error) {
    console.error('Chapa Error:', error.response?.data || error.message)
    res.status(500).json({
      error: error.response?.data || 'Payment initialization failed',
    })
  }
}

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    )

    if (response.data.status === 'success') {
      // ✅ Update your booking/order DB here
      res.status(200).json({ success: true, data: response.data.data })
    } else {
      res.status(400).json({ success: false, data: response.data.data })
    }
  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: 'Verification failed' })
  }
}
