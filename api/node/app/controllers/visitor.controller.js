const db = require("../models");
const Visitor = db.visitors;
const Download = db.downloads;
const Op = db.Sequelize.Op;

// Helper function untuk get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

// PUBLIC ENDPOINTS

// Record visitor - Public endpoint
exports.recordVisitor = async (req, res) => {
  try {
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'];
    const pageUrl = req.body.pageUrl || '/';
    const today = new Date().toISOString().split('T')[0];

    console.log('Recording visitor:', { ipAddress, pageUrl });

    // Coba insert, jika sudah ada akan diabaikan
    await Visitor.findOrCreate({
      where: {
        ip_address: ipAddress,
        visit_date: today
      },
      defaults: {
        ip_address: ipAddress,
        visit_date: today,
        user_agent: userAgent,
        page_url: pageUrl
      }
    });

    res.status(200).json({ 
      message: 'Visitor recorded successfully' 
    });

  } catch (error) {
    console.error('Error recording visitor:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Record download - Public endpoint
exports.recordDownload = async (req, res) => {
  try {
    const ipAddress = getClientIP(req);
    const { fileName, userUuid, fileType } = req.body;

    if (!fileName) {
      return res.status(400).json({ 
        error: 'fileName is required' 
      });
    }

    console.log('Recording download:', { ipAddress, fileName, fileType });

    await Download.create({
      ip_address: ipAddress,
      file_name: fileName,
      user_uuid: userUuid || null,
      file_type: fileType || 'general'
    });

    res.status(200).json({ 
      message: 'Download recorded successfully' 
    });

  } catch (error) {
    console.error('Error recording download:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Get visitor statistics - Public endpoint
exports.getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    console.log('Getting stats for:', { today, currentMonth });

    // Visitors today (PostgreSQL compatible)
    const visitorsToday = await Visitor.count({
      where: {
        visit_date: today  // Direct date comparison
      }
    });

    // Visitors this month (PostgreSQL compatible)
    const visitorsThisMonth = await Visitor.count({
      where: {
        visit_date: {
          [Op.gte]: `${currentMonth}-01`,  // Greater than or equal first day of month
          [Op.lt]: getNextMonth(currentMonth)  // Less than first day of next month
        }
      }
    });

    // Downloads today (PostgreSQL compatible)
    const downloadsToday = await Download.count({
      where: {
        download_date: today  // Direct date comparison
      }
    });

    // Downloads this month (PostgreSQL compatible)
    const downloadsThisMonth = await Download.count({
      where: {
        download_date: {
          [Op.gte]: `${currentMonth}-01`,
          [Op.lt]: getNextMonth(currentMonth)
        }
      }
    });

    console.log('Visitor stats result:', {
      visitorsToday,
      visitorsThisMonth,
      downloadsToday,
      downloadsThisMonth
    });

    res.status(200).json({
      visitorsToday,
      visitorsThisMonth,
      downloadsToday,
      downloadsThisMonth
    });

  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Helper function untuk get next month
const getNextMonth = (currentMonth) => {
  const [year, month] = currentMonth.split('-');
  const nextMonth = parseInt(month) + 1;
  
  if (nextMonth > 12) {
    return `${parseInt(year) + 1}-01-01`;
  } else {
    return `${year}-${nextMonth.toString().padStart(2, '0')}-01`;
  }
};

// Health check - Public endpoint
exports.healthCheck = (req, res) => {
  res.json({ 
    module: 'visitor',
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL'
  });
};

// ADMIN ENDPOINTS

// Get detailed statistics - Admin only
exports.getDetailedStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'startDate and endDate are required' 
      });
    }

    console.log('Getting detailed stats:', { startDate, endDate });

    // Get visitors in date range (PostgreSQL compatible)
    const visitors = await Visitor.findAll({
      where: {
        visit_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['visit_date', 'DESC']]
    });

    // Get downloads in date range (PostgreSQL compatible)
    const downloads = await Download.findAll({
      where: {
        download_date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['download_date', 'DESC']]
    });

    res.status(200).json({
      visitors,
      downloads,
      summary: {
        totalVisitors: visitors.length,
        totalDownloads: downloads.length
      }
    });

  } catch (error) {
    console.error('Error getting detailed stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Get download stats by type - Admin only
exports.getDownloadStats = async (req, res) => {
  try {
    const { days } = req.query;
    const daysInt = parseInt(days) || 30;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysInt);
    const startDateStr = startDate.toISOString().split('T')[0];

    console.log('Getting download stats by type:', { days: daysInt, startDate: startDateStr });

    // PostgreSQL compatible aggregation
    const stats = await Download.findAll({
      attributes: [
        'file_type',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'download_count']
      ],
      where: {
        download_date: {
          [Op.gte]: startDateStr
        }
      },
      group: ['file_type'],
      order: [[db.sequelize.literal('download_count'), 'DESC']]
    });

    res.status(200).json(stats);

  } catch (error) {
    console.error('Error getting download stats by type:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Get analytics data - Admin only
exports.getAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year'
    let startDate = new Date();
    
    // Set date range based on period
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const startDateStr = startDate.toISOString().split('T')[0];

    console.log('Getting analytics:', { period, startDate: startDateStr });

    // Daily visitor trend (PostgreSQL compatible)
    const dailyVisitors = await Visitor.findAll({
      attributes: [
        'visit_date',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'visitor_count']
      ],
      where: {
        visit_date: {
          [Op.gte]: startDateStr
        }
      },
      group: ['visit_date'],
      order: [['visit_date', 'ASC']]
    });

    // Daily download trend (PostgreSQL compatible)
    const dailyDownloads = await Download.findAll({
      attributes: [
        'download_date',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'download_count']
      ],
      where: {
        download_date: {
          [Op.gte]: startDateStr
        }
      },
      group: ['download_date'],
      order: [['download_date', 'ASC']]
    });

    // Top pages (PostgreSQL compatible)
    const topPages = await Visitor.findAll({
      attributes: [
        'page_url',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'visit_count']
      ],
      where: {
        visit_date: {
          [Op.gte]: startDateStr
        },
        page_url: {
          [Op.ne]: null  // Not null
        }
      },
      group: ['page_url'],
      order: [[db.sequelize.literal('visit_count'), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      dailyVisitors,
      dailyDownloads,
      topPages
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Export data to CSV - Admin only
exports.exportData = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    if (!type || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'type, startDate and endDate are required' 
      });
    }

    console.log('Exporting data:', { type, startDate, endDate });

    let data;
    let filename;
    let headers;

    if (type === 'visitors') {
      data = await Visitor.findAll({
        where: {
          visit_date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['visit_date', 'DESC']]
      });
      filename = `visitors_${startDate}_to_${endDate}.csv`;
      headers = 'IP Address,Visit Date,Page URL,User Agent,Created At\n';
    } else if (type === 'downloads') {
      data = await Download.findAll({
        where: {
          download_date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['download_date', 'DESC']]
      });
      filename = `downloads_${startDate}_to_${endDate}.csv`;
      headers = 'IP Address,File Name,File Type,User UUID,Download Date,Download Time\n';
    } else {
      return res.status(400).json({ error: 'Invalid export type' });
    }

    // Convert to CSV
    let csv = headers;
    data.forEach(item => {
      if (type === 'visitors') {
        csv += `"${item.ip_address}","${item.visit_date}","${item.page_url || ''}","${item.user_agent || ''}","${item.createdAt}"\n`;
      } else {
        csv += `"${item.ip_address}","${item.file_name}","${item.file_type}","${item.user_uuid || ''}","${item.download_date}","${item.download_time}"\n`;
      }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);

  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Reset stats - Super Admin only
exports.resetStats = async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'RESET_ALL_VISITOR_DATA') {
      return res.status(400).json({ 
        error: 'Invalid confirmation. Please send: {"confirm": "RESET_ALL_VISITOR_DATA"}' 
      });
    }

    console.log('RESETTING ALL VISITOR DATA - Admin action');

    // Delete all visitor and download data (PostgreSQL compatible)
    await Download.destroy({ where: {}, truncate: true });
    await Visitor.destroy({ where: {}, truncate: true });

    res.status(200).json({ 
      message: 'All visitor data has been reset',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error resetting stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};