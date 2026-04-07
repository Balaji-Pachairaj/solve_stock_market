const sgMail = require("@sendgrid/mail");

class SendGridSend {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY not set");
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendGainLoss(htmlContent, meta) {
    const msg = {
      to: "balajipachairaj@gmail.com",
      from: "pachairajbalaji@gmail.com", // change this
      subject: meta ? meta?.title : "📊 Gain/Loss Report - Daily",
      html: htmlContent, // raw HTML
    };

    try {
      const res = await sgMail.send(msg);
      console.log("Email sent:", res[0].statusCode);
      return res;
    } catch (err) {
      console.error("SendGrid error:", err.response?.body || err.message);
      throw err;
    }
  }
}

module.exports = {
  SendGridSend,
};
