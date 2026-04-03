const User = require('../models/User');
const AdherenceLog = require('../models/AdherenceLog');

/**
 * Service to calculate and update Gamification metrics (Streaks, Health Scores, Badges).
 */
const GamificationService = {
  /**
   * Recalculate and update a user's current streak and health score.
   * @param {string} userId - User ID to update.
   */
  async updateMetrics(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    // 1. Calculate Current Streak
    // Logic: Look at historical adherence logs and see how many consecutive "TAKEN" days we have.
    const logs = await AdherenceLog.find({ user_id: userId })
      .sort({ scheduled_time: -1 })
      .limit(30);

    let streak = 0;
    for (const log of logs) {
      if (log.status === 'TAKEN') {
        streak++;
      } else if (log.status === 'MISSED' || log.status === 'DELAYED') {
        break; // Streak broken
      }
    }

    user.currentStreak = streak;
    if (streak > user.maxStreak) {
      user.maxStreak = streak;
    }

    // 2. Calculate Health Score (0-100)
    // Formula: (Total TAKEN logs in last 30 logs) / (Total logs in last 30 logs) * 100
    const takenCount = logs.filter(l => l.status === 'TAKEN').length;
    const totalCount = logs.length || 1;
    user.healthScore = Math.round((takenCount / totalCount) * 100);

    // 3. Award Badges
    const badgeNames = user.badges.map(b => b.name);
    
    if (streak >= 7 && !badgeNames.includes('7_DAY_STREAK')) {
      user.badges.push({ name: '7_DAY_STREAK' });
    }
    if (user.healthScore >= 95 && totalCount >= 10 && !badgeNames.includes('DIAMOND_ADHERENCE')) {
      user.badges.push({ name: 'DIAMOND_ADHERENCE' });
    }

    await user.save();
    return user;
  },

  /**
   * Get leaderboard of top patients by Health Score.
   */
  async getLeaderboard() {
    return await User.find({ role: 'PATIENT' })
      .select('name healthScore currentStreak badges')
      .sort({ healthScore: -1, currentStreak: -1 })
      .limit(10);
  },
};

module.exports = GamificationService;
