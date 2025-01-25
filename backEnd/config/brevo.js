const Brevo = require("sib-api-v3-sdk");
require("dotenv").config();

// Initialize Brevo client
const client = Brevo.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi = new Brevo.TransactionalEmailsApi();

module.exports = transactionalEmailApi;
