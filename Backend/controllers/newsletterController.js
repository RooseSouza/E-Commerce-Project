const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const sendEmail = require("../utils/sendEmail");

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const alreadySubscribed = await NewsletterSubscriber.findOne({ email });
    if (alreadySubscribed) {
      return res.status(400).json({
        message: "This email is already subscribed",
      });
    }

    await NewsletterSubscriber.create({ email });

    // 📧 SEND CONFIRMATION EMAIL
    await sendEmail({
      to: email,
      subject: "Welcome to our Newsletter 🎉",
      html: `
        <h2>Thanks for subscribing!</h2>
        <p>You have successfully subscribed to our newsletter.</p>
        <p>You’ll now receive updates, offers, and news from us.</p>
        <br/>
        <p>— Team Bazaran</p>
      `,
    });

    res.json({ message: "Subscribed successfully. Check your email!" });
  } catch (error) {
    console.error("NEWSLETTER ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
