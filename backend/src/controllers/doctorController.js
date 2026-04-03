const AdherenceLog = require('../models/AdherenceLog');
const User = require('../models/User');

/**
 * Controller for Doctor-specific views and patient monitoring data.
 */

// 1. Get List of High-Risk Patients
// Patients with complianceScore < 60% are prioritized
const getHighRiskPatients = async (req, res, next) => {
  try {
    // 1. Get all patients
    const patients = await User.find({ role: 'PATIENT' });
    
    // 2. Map through patients to calculate their current compliance scores
    const patientsWithScores = await Promise.all(
      patients.map(async (patient) => {
        const logs = await AdherenceLog.find({ user_id: patient._id });
        
        const totalLogs = logs.length;
        const takenLogs = logs.filter(log => log.status === 'TAKEN').length;
        const missedLogs = logs.filter(log => log.status === 'MISSED').length;
        
        // Find consecutive missed doses
        let consecutiveMissed = 0;
        const sortedLogs = logs.sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time));
        for (const log of sortedLogs) {
          if (log.status === 'MISSED') consecutiveMissed++;
          else if (log.status === 'TAKEN') break;
        }

        const complianceScore = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;
        const lastMissedLog = logs.filter(l => l.status === 'MISSED').sort((a,b) => new Date(b.scheduled_time) - new Date(a.scheduled_time))[0];

        return {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          complianceScore,
          consecutiveMissedDoses: consecutiveMissed,
          lastMissedDate: lastMissedLog ? lastMissedLog.scheduled_time : null,
          mimic_subject_id: patient.mimic_subject_id,
          healthScore: patient.healthScore || 100
        };
      })
    );

    // Frontend handles further filtering but we return the full list or pre-filter here
    res.status(200).json({ success: true, count: patientsWithScores.length, patients: patientsWithScores });
  } catch (error) {
    next(error);
  }
};

// 2. Get Specific Patient Detail
const getPatientDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);
    
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const logs = await AdherenceLog.find({ user_id: id }).sort({ scheduled_time: -1 });
    const taken = logs.filter(l => l.status === 'TAKEN').length;
    const complianceScore = logs.length > 0 ? Math.round((taken / logs.length) * 100) : 100;

    res.status(200).json({
      success: true,
      data: {
        ...patient.toObject(),
        complianceScore,
        totalLogs: logs.length,
        logs: logs.slice(0, 50) // Return last 50 logs for history
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Compliance Data (Daily/Weekly/Monthly)
const getComplianceData = async (req, res, next) => {
  try {
    const { id } = req.params;
    // For simplicity, we'll return a daily aggregation of the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await AdherenceLog.find({
      user_id: id,
      scheduled_time: { $gte: sevenDaysAgo }
    }).sort({ scheduled_time: 1 });

    // Aggregate by date
    const dailyData = {};
    logs.forEach(log => {
      const date = log.scheduled_time.toISOString().split('T')[0];
      if (!dailyData[date]) dailyData[date] = { date, taken: 0, total: 0 };
      dailyData[date].total++;
      if (log.status === 'TAKEN') dailyData[date].taken++;
    });

    const result = Object.values(dailyData).map(d => ({
      ...d,
      score: Math.round((d.taken / d.total) * 100)
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// 4. Get Missed Doses List
const getMissedDoses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    const cutOff = new Date();
    cutOff.setDate(cutOff.getDate() - parseInt(days));

    const missedDoses = await AdherenceLog.find({
      user_id: id,
      status: 'MISSED',
      scheduled_time: { $gte: cutOff }
    }).sort({ scheduled_time: -1 });

    res.status(200).json({ success: true, count: missedDoses.length, missedDoses });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHighRiskPatients,
  getPatientDetail,
  getComplianceData,
  getMissedDoses
};
