const { NextResponse } = require("next/server")
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = twilio(accountSid, authToken)

export async function POST(request) {
    try {
        const data = await request.json()

        // Agrega el código de país antes del número de teléfono
        const phoneNumberWithCountryCode = `+56${data.to}`;

        const message = await client.messages.create({
            body: "Tu reserva ha sido cancelada. Lamentamos los inconvenientes, vuelve a reagendar con nosotros...",
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumberWithCountryCode
        });

        console.log(message.sid);
        return NextResponse.json({ message: 'message sent' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error sending message' });
    }
}