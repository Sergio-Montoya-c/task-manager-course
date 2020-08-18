const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
  console.log(`Sending email to ${email}`)
  sgMail.send({
    to: email,
    from: 'sergio@michelada.io',
    subject: 'Thanks for joining in!',
    text: `Welcome to the TaskManager ${name}. Let me know how you get along with the app.`
  })
}

const sendCancellationEmail = async (email, name) => {
  console.log(`Sending cancellation email to ${email}`)
  sgMail.send({
    to: email,
    from: 'sergio@michelada.io',
    subject: 'Sorry to see you go :(',
    text: `Hi ${name}, we are sad to see you go. Tell us what could have we done better to keep you arond.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
}