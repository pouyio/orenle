module.exports = {
  private_key: Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY,
    "base64"
  ),
  client_email: process.env.GOOGLE_APPLICATION_CREDENTIALS_CLIENT_EMAIL,
};
