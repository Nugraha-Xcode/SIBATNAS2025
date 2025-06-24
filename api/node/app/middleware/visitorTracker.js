const db = require("../models");
const Visitor = db.visitors;

const visitorTracker = async (req, res, next) => {
  try {
    // Skip tracking untuk API endpoints dan static files
    const skipPaths = ['/api/', '/static/', '/favicon.ico', '/robots.txt', '/assets/'];
    const shouldSkip = skipPaths.some(path => req.path.includes(path));
    
    // Hanya track GET requests dan bukan API calls
    if (!shouldSkip && req.method === 'GET') {
      const ipAddress = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.connection.remoteAddress || 
                       req.socket.remoteAddress ||
                       (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                       '127.0.0.1';
      
      const userAgent = req.headers['user-agent'];
      const pageUrl = req.originalUrl;
      const today = new Date().toISOString().split('T')[0];

      // Record visitor asynchronously (tidak menghambat response)
      Visitor.findOrCreate({
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
      }).catch(error => {
        console.error('Error auto-tracking visitor:', error.message);
      });
    }
  } catch (error) {
    console.error('Error in visitor tracker middleware:', error.message);
  }
  
  next();
};

module.exports = visitorTracker;