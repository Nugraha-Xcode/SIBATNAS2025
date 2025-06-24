require('dotenv').config();
const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const https = require('https');
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const INA_GEO_RECAPTCHA_SECRET_KEY = process.env.INA_GEO_RECAPTCHA_SECRET_KEY || "6LeH8XwhAAAAAKm0KPh5YRrDPozE_fEPbqFfCf3e";

const redis = require("../utils/redisClient");
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60; // 2 hour in seconds

const getLoginAttemptsKey = (email) => `login_attempts:${email}`;
const { userInputPasswordCheck } = require("../utils/user_validation");

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ uuid: user.uuid }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        if (authorities.length > 0) {
          if (authorities[0] == "ROLE_EKSTERNAL") {
            ekst = await user.getEksternals();
            reg = await db.eksternal.findByPk(ekst[0].id, {
              include: [
                {
                  model: db.kategoriEksternal,
                  as: "kategoriEksternal",
                  attributes: ["uuid", "name"],
                },
                {
                  model: db.region,
                  as: "regions",
                  attributes: ["id", "uuid", "kode", "name"],
                  through: {
                    attributes: [],
                  },
                },
              ],
              attributes: ["uuid", "name", "akronim"],
            });
            //khusus region pemerintah kab/kota
            if (ekst[0].kategoriEksternalId == 3) {
              res.status(200).send({
                uuid: user.uuid,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                eksternal: reg,
                refreshToken: refreshToken,
              });
            } else {
              res.status(200).send({
                uuid: user.uuid,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken: refreshToken,
              });
            }
          } else {
            res.status(200).send({
              uuid: user.uuid,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token,
              refreshToken: refreshToken,
            });
          }
        } else {
          return res.status(401).send({
            accessToken: null,
            message: "Role not found",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signinCaptcha = async (req, res) => {
  const { email, password, token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token recaptcha not found" });
  }
  const loginAttemptsKey = getLoginAttemptsKey(email);
  try {
    const attempts = await redis.get(loginAttemptsKey);

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const ttl = await redis.ttl(loginAttemptsKey);

      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Please wait for ${Math.ceil(
          ttl / 60
        )} minutes and try again.`,
      });
    }
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`;
    const { data } = await axios.post(
      verificationUrl,
      null,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    );

    if (!data.success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    }

    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: "User is not found" });
        }
        let passwordIsValid = false;
        if (user.password != "") {
          passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
        } else {
          const cek = await User.update(
            {
              password: bcrypt.hashSync(req.body.password, 8),
            },
            {
              where: { uuid: user.uuid },
            }
          );
          if (cek == 1) {
            passwordIsValid = true;
          } else {
            passwordIsValid = false;
          }
        }
        if (!passwordIsValid) {
          await redis.incr(loginAttemptsKey);
          await redis.expire(loginAttemptsKey, LOCK_TIME);

          const remainingAttempts =
            MAX_LOGIN_ATTEMPTS - (await redis.get(loginAttemptsKey));
          return res.status(401).json({
            success: false,
            message: `Invalid credentials. You have ${remainingAttempts} more attempts left.`,
          });
        }
        await redis.del(loginAttemptsKey);

        const token = jwt.sign({ uuid: user.uuid }, config.secret, {
          expiresIn: config.jwtExpiration,
        });
        let refreshToken = await RefreshToken.createToken(user);

        let authorities = [];
        user.getRoles().then(async (roles) => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
          if (authorities.length > 0) {
            res.status(200).send({
              uuid: user.uuid,
              username: user.username,
              email: user.email,
              fullname: user.fullname,
              phone: user.phone,
              roles: authorities,
              accessToken: token,
              refreshToken: refreshToken,
            });
          } else {
            return res.status(401).send({
              accessToken: null,
              message: "Role not found",
            });
          }
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// New method for INA Geo login
exports.signinInaGeo = async (req, res) => {
  console.log("=== INA GEO LOGIN START ===");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    // Validate request body exists
    if (!req.body) {
      console.log("ERROR: No request body found");
      return res.status(400).json({ 
        success: false, 
        message: "Request body is required" 
      });
    }

    const { email, password, token } = req.body;
    
    console.log("Extracted values:");
    console.log("- email:", email);
    console.log("- password:", password ? "[HIDDEN]" : "undefined");
    console.log("- token:", token ? token.substring(0, 20) + "..." : "undefined");

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: "Password is required" 
      });
    }

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "reCAPTCHA token is required" 
      });
    }

    const loginAttemptsKey = getLoginAttemptsKey(email);

    // Check rate limiting (with Redis error handling)
    let attempts = 0;
    try {
      attempts = await redis.get(loginAttemptsKey) || 0;
      console.log("Current login attempts:", attempts);
    } catch (redisError) {
      console.log("Redis error (continuing without rate limiting):", redisError.message);
    }

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      try {
        const ttl = await redis.ttl(loginAttemptsKey);
        return res.status(429).json({
          success: false,
          message: `Too many login attempts. Please wait for ${Math.ceil(
            ttl / 60
          )} minutes and try again.`,
        });
      } catch (redisError) {
        console.log("Redis TTL error:", redisError.message);
      }
    }

    // reCAPTCHA Verification with Development Bypass
    let recaptchaValid = false;
    
    if (process.env.NODE_ENV === 'development' || process.env.BYPASS_RECAPTCHA === 'true') {
      console.log("🔥 DEVELOPMENT MODE: Bypassing reCAPTCHA verification");
      recaptchaValid = true;
    } else {
      console.log("🔒 PRODUCTION MODE: Verifying reCAPTCHA...");
      
      try {
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${INA_GEO_RECAPTCHA_SECRET_KEY}&response=${token}`;
        
        const { data } = await axios.post(
          verificationUrl,
          null,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            httpsAgent: new https.Agent({
              rejectUnauthorized: false
            }),
            timeout: 10000
          }
        );

        console.log("reCAPTCHA verification result:", data);

        if (data.success) {
          recaptchaValid = true;
        } else {
          console.log("reCAPTCHA verification failed:", data['error-codes']);
          return res.status(400).json({ 
            success: false, 
            message: "reCAPTCHA verification failed",
            details: data['error-codes']
          });
        }
      } catch (captchaError) {
        console.log("reCAPTCHA verification error:", captchaError.message);
        return res.status(500).json({ 
          success: false, 
          message: "reCAPTCHA verification service error" 
        });
      }
    }

    if (!recaptchaValid) {
      return res.status(400).json({ 
        success: false, 
        message: "reCAPTCHA verification required" 
      });
    }

    console.log("✅ reCAPTCHA verification passed");

    // Call INA Geo API
    console.log("📡 Calling INA Geo API...");
    let inaGeoResponse;
    
    try {
      inaGeoResponse = await axios.post(
        'https://tanahair.indonesia.go.id/api-inageo/auth/signin',
        {
          email: email,
          password: password,
          token: token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'SIBATNAS-SSO/1.0',
            'Accept': 'application/json'
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          }),
          timeout: 15000
        }
      );

      console.log("INA Geo API response status:", inaGeoResponse.status);
      console.log("INA Geo API response data:", JSON.stringify(inaGeoResponse.data, null, 2));

    } catch (inaGeoError) {
      console.log("❌ INA Geo API error:", inaGeoError.message);
      
      if (inaGeoError.response) {
        console.log("INA Geo error status:", inaGeoError.response.status);
        console.log("INA Geo error data:", inaGeoError.response.data);
      }

      // Increment login attempts on INA Geo authentication failure
      try {
        await redis.incr(loginAttemptsKey);
        await redis.expire(loginAttemptsKey, LOCK_TIME);
      } catch (redisError) {
        console.log("Redis increment error:", redisError.message);
      }

      return res.status(401).json({
        success: false,
        message: "Invalid credentials via INA Geo",
        details: inaGeoError.response?.data || inaGeoError.message
      });
    }

    // Validate INA Geo response
    if (!inaGeoResponse.data) {
      console.log("❌ INA Geo login failed - empty response");
      return res.status(401).json({
        success: false,
        message: "Empty response from INA Geo",
      });
    }

    // Handle different INA Geo response formats
    const inaGeoData = inaGeoResponse.data;
    
    // Check if login was successful (INA Geo might not use 'success' field)
    if (inaGeoData.success === false) {
      console.log("❌ INA Geo login explicitly failed");
      return res.status(401).json({
        success: false,
        message: "Authentication failed via INA Geo",
        details: inaGeoData.message || "Invalid credentials"
      });
    }

    console.log("✅ INA Geo authentication successful");

    // Clear login attempts on successful authentication
    try {
      await redis.del(loginAttemptsKey);
      console.log("Login attempts cleared");
    } catch (redisError) {
      console.log("Redis delete error:", redisError.message);
    }

    // Check if user exists in database
    console.log("👤 Checking if user exists in database...");
    let user = await User.findOne({
      where: {
        email: email,
        is_sso: true,
        sso_provider: 'inageo'
      },
    });

    if (!user) {
      console.log("👤 Creating new INA Geo user...");
      const newUserUuid = uuidv4();
      
      try {
        user = await User.create({
          uuid: newUserUuid,
          fullname: inaGeoData.fullname || inaGeoData.name || email,
          username: email,
          email: email,
          password: "", // Empty password for SSO users
          phone: inaGeoData.phone || "",
          is_sso: true,
          sso_provider: 'inageo',
          ina_geo_uuid: inaGeoData.uuid || inaGeoData.id || null,
          last_ina_geo_sync: new Date()
        });

        console.log("✅ New user created with UUID:", newUserUuid);

        // Assign walidata role
        const walidataRole = await Role.findOne({ where: { name: 'walidata' } });
        if (walidataRole) {
          await user.setRoles([walidataRole.id]);
          console.log("✅ Assigned walidata role to new user");
        } else {
          console.log("⚠️  WARNING: walidata role not found in database, creating it...");
          
          // Create walidata role if it doesn't exist
          const newRole = await Role.create({
            name: 'walidata'
          });
          await user.setRoles([newRole.id]);
          console.log("✅ Created and assigned walidata role");
        }
      } catch (userCreateError) {
        console.log("❌ Error creating user:", userCreateError.message);
        return res.status(500).json({
          success: false,
          message: "Error creating user account"
        });
      }
    } else {
      console.log("👤 Updating existing INA Geo user...");
      
      try {
        // Update existing user info
        await User.update({
          fullname: inaGeoData.fullname || inaGeoData.name || user.fullname,
          phone: inaGeoData.phone || user.phone,
          ina_geo_uuid: inaGeoData.uuid || inaGeoData.id || user.ina_geo_uuid,
          last_ina_geo_sync: new Date()
        }, {
          where: { uuid: user.uuid }
        });
        
        // Reload user data
        user = await User.findByPk(user.id);
        console.log("✅ User data updated");
      } catch (userUpdateError) {
        console.log("⚠️  Warning: Error updating user:", userUpdateError.message);
        // Continue anyway with existing user data
      }
    }

    // Generate JWT token
    console.log("🔑 Generating JWT token...");
    const jwtToken = jwt.sign({ uuid: user.uuid }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    // Create refresh token
    let refreshToken = await RefreshToken.createToken(user);
    console.log("🔄 Refresh token created");

    // Get user roles
    console.log("🔐 Getting user roles...");
    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    console.log("User roles:", authorities);

    const responseData = {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      roles: authorities,
      accessToken: jwtToken,
      refreshToken: refreshToken,
      sso_provider: 'inageo',
      ina_geo_token: inaGeoData.accessToken || null
    };

    console.log("✅ Sending success response");
    console.log("=== INA GEO LOGIN SUCCESS ===");
    
    res.status(200).send(responseData);

  } catch (error) {
    console.log("=== INA GEO LOGIN ERROR ===");
    console.error("❌ Unexpected error in signinInaGeo:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.password = (req, res) => {
  const uuid = req.params.uuid;

  User.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      } else {
        const passwordIsValid = bcrypt.compareSync(
          req.body.passwordOld,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            message: "Wrong Old Password!",
          });
        }

        if (!userInputPasswordCheck(req.body.passwordNew)) {
          return res.status(404).send({
            message:
              "Password baru minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol.",
          });
        }

        if (req.body.passwordNew != req.body.passwordRepeat) {
          return res.status(401).send({
            message: "New Password and Repeat Password does not match!",
          });
        }

        User.update(
          {
            password: bcrypt.hashSync(req.body.passwordNew, 8),
          },
          {
            where: { uuid: uuid },
          }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "User was updated successfully.",
              });
            } else {
              res.send({
                message: `Cannot update User with uuid=${uuid}. Maybe User was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating User with uuid=" + uuid,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with uuid=" + uuid,
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    console.log(refreshToken);

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};