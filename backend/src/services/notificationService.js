const admin = require('../config/firebase');
const twilio = require('twilio');
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Load environment variables for Twilio (the user will need to configure these later)
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient;

// Initialize Twilio client if the credentials are provided
if (twilioSid && twilioToken) {
  twilioClient = twilio(twilioSid, twilioToken);
}

/**
 * Service to handle all application notifications (Push and SMS).
 */
const NotificationService = {
  /**
   * Send a push notification via Firebase Cloud Messaging (FCM).
   * @param {string} token - The recipient's FCM registration token.
   * @param {string} title - The title of the notification.
   * @param {string} body - The message content.
   * @param {Object} [data] - Optional metadata associated with the notification.
   */
  async sendPushNotification(token, title, body, data = {}) {
    if (!token) return { success: false, error: 'No FCM token provided' };

    const message = {
      notification: { title, body },
      token: token,
      data: data,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('✅ Push notification sent successfully:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send an SMS notification via Twilio.
   * @param {string} phoneNumber - The recipient's phone number.
   * @param {string} body - The message content.
   */
  async sendSMS(phoneNumber, body) {
    if (!twilioClient) {
      console.warn('⚠️ Twilio is not configured. SMS not sent.');
      return { success: false, error: 'Twilio not configured' };
    }

    try {
      const message = await twilioClient.messages.create({
        body: body,
        from: twilioNumber,
        to: phoneNumber,
      });
      console.log('✅ SMS sent successfully:', message.sid);
      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Smart Escalation Logic (Tiered Alerts).
   * @param {Object} patient - The patient object (contains name, caregiver phone, doctor phone).
   * @param {number} tier - Escalation tier (1, 2, or 3).
   * @param {string} medName - Name of the missed medication.
   */
  async triggerEscalation(patient, tier, medName) {
    const messages = {
      1: `⏰ HealMate Reminder: It's time to take your ${medName}. Don't miss your dose!`,
      2: `🚨 Alert: ${patient.name} has missed multiple doses of ${medName}. Please check in on them.`,
      3: `⚠️ Critical Alert: Patient ${patient.name} shows a serious non-adherence pattern for ${medName}. Immediate doctor review required.`,
    };

    const message = messages[tier];

    // Tier 1: Patient (Push + potentially SMS)
    if (tier === 1) {
      if (patient.fcmToken) {
        await this.sendPushNotification(patient.fcmToken, 'Medication Reminder', message);
      }
      if (patient.phone) {
        // Only SMS patient in Tier 1 if they want it
        // await this.sendSMS(patient.phone, message);
      }
    }

    // Tier 2: Caregiver (SMS)
    if (tier === 2 && patient.caregiverPhone) {
      await this.sendSMS(patient.caregiverPhone, message);
    }

    // Tier 3: Doctor (SMS / High Priority Push)
    if (tier === 3 && patient.doctorPhone) {
      await this.sendSMS(patient.doctorPhone, message);
    }
    
    return { status: 'Triggered', tier };
  },

  /**
   * Smart AI-Integrated Reminder.
   * Calls Phase 4 AI model and sends dynamic alert based on risk level.
   * @param {Object} patient - Patient data needed for AI (age, prescriptions, etc.).
   * @param {string} medName - Name of the medication.
   */
  async predictAdherenceAndNotify(patient, medName) {
    try {
      // 1. Call AI microservice for prediction
      const response = await axios.post(`${AI_SERVICE_URL}/predict_risk`, {
        age: patient.age || 45,
        total_prescriptions: patient.total_prescriptions || 5,
        unique_drugs: patient.unique_drugs || 3,
        oral_drug_count: patient.oral_drug_count || 4,
        non_oral_drug_count: patient.non_oral_drug_count || 1,
        avg_dose_duration_days: patient.avg_dose_duration_days || 30,
        max_concurrent_meds: patient.max_concurrent_meds || 2,
        num_admissions: patient.num_admissions || 1,
        avg_icu_los: patient.avg_icu_los || 0.5,
        route_diversity: patient.route_diversity || 1,
      });

      const { predicted_risk_level, risk_score_percentage } = response.data;

      // 2. Decide based on AI risk level
      let message = '';
      if (predicted_risk_level === 'High') {
        message = `⚠️ Warning: AI predicts a high risk of non-adherence. Please remember your ${medName}! (Risk Score: ${risk_score_percentage}%)`;
      } else if (predicted_risk_level === 'Medium') {
        message = `⏰ Just a friendly HealMate reminder for your ${medName}. Consistency is key!`;
      } else {
        // Low risk patients might get a softer nudge
        message = `✅ You're doing great! Keep up the good work with your ${medName}.`;
      }

      // 3. Send the proactive Push/SMS
      if (patient.fcmToken) {
        await this.sendPushNotification(patient.fcmToken, 'Smart Adherence Alert', message);
      }
      
      console.log(`🧠 AI Prediction used: Level=${predicted_risk_level}, Score=${risk_score_percentage}%`);
      return response.data;
    } catch (error) {
      console.error('❌ AI Integration Error in NotificationService:', error.message);
      return { error: 'Failed to integrate AI predictions' };
    }
  },
};

module.exports = NotificationService;
