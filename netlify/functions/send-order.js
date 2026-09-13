exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const {
      name,
      phone,
      email,
      comment,
      items,
      total,
    } = JSON.parse(event.body);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const orderList = items
      .map(
        (item) =>
          `• ${item.title} × ${item.quantity} — £${(
            item.price * item.quantity
          ).toFixed(2)}`,
      )
      .join("\n");

    const message = `
🕯️ <b>NEW EMBER ORDER</b>

👤 <b>Name:</b> ${name}
📞 <b>Phone:</b> ${phone}
📧 <b>Email:</b> ${email}

🛍 <b>ORDER</b>

${orderList}

💷 <b>Total:</b> £${total.toFixed(2)}

💬 <b>Comment</b>

${comment || "—"}
`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};