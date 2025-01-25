const transactionalEmailApi = require('../config/brevo');

// Send Reminder Email
exports.sendReminder = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const sendSmtpEmail = {
      to: [{ email }],
      sender: { name: "Job Tracker", email: "20BCS1973@cuchd.in" },
      subject,
      htmlContent: `<p>${message}</p>`,
    };

    await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: "Reminder email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reminder email", error });
  }
};
