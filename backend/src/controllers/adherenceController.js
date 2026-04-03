const AdherenceLog = require('../models/AdherenceLog');
const Medication = require('../models/Medication');
const User = require('../models/User');

/**
 * @route   POST /api/adherence/log
 * @desc    Log a medication intake
 * @access  Private (patient)
 */
const logIntake = async (req, res, next) => {
  try {
    const { medicationId, scheduledTime, takenAt, status, notes } = req.body;

    const medication = await Medication.findById(medicationId);
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found.' });

    const scheduled = new Date(scheduledTime);
    const taken = takenAt ? new Date(takenAt) : null;
    const delayMinutes = taken ? Math.round((taken - scheduled) / 60000) : 0;

    const log = await AdherenceLog.create({
      patient: req.user._id,
      medication: medicationId,
      scheduledTime: scheduled,
      takenAt: taken,
      status: status || (taken ? (delayMinutes > 30 ? 'late' : 'taken') : 'missed'),
      delayMinutes,
      notes,
    });

    // Update streak and health score
    if (log.status === 'taken' || log.status === 'late') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { streak: 1, healthScore: log.status === 'taken' ? 2 : 1 },
      });
    } else if (log.status === 'missed') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { streak: -1, healthScore: -3 },
      });
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/adherence?patientId=&startDate=&endDate=
 * @desc    Get adherence logs with optional filters
 * @access  Private
 */
const getAdherenceLogs = async (req, res, next) => {
  try {
    const { patientId, startDate, endDate, medicationId } = req.query;
    const targetId = req.user.role === 'patient' ? req.user._id : patientId;

    const filter = { patient: targetId };
    if (medicationId) filter.medication = medicationId;
    if (startDate || endDate) {
      filter.scheduledTime = {};
      if (startDate) filter.scheduledTime.$gte = new Date(startDate);
      if (endDate) filter.scheduledTime.$lte = new Date(endDate);
    }

    const logs = await AdherenceLog.find(filter)
      .populate('medication', 'name dosage')
      .sort({ scheduledTime: -1 })
      .limit(200);

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/adherence/stats?patientId=&period=weekly|monthly
 * @desc    Get adherence summary stats (% taken, missed, late)
 * @access  Private
 */
const getAdherenceStats = async (req, res, next) => {
  try {
    const { patientId, period = 'weekly' } = req.query;
    const targetId = req.user.role === 'patient' ? req.user._id : patientId;

    const days = period === 'monthly' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await AdherenceLog.find({
      patient: targetId,
      scheduledTime: { $gte: startDate },
    });

    const total = logs.length;
    const taken = logs.filter((l) => l.status === 'taken').length;
    const late = logs.filter((l) => l.status === 'late').length;
    const missed = logs.filter((l) => l.status === 'missed').length;
    const skipped = logs.filter((l) => l.status === 'skipped').length;

    const adherenceRate = total > 0 ? Math.round(((taken + late) / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        period,
        total,
        taken,
        late,
        missed,
        skipped,
        adherenceRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { logIntake, getAdherenceLogs, getAdherenceStats };
