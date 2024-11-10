const Team = require("../models/farukFootballModel");
const cloudinary = require("cloudinary").v2;

// Register a new team
const registerTeam = async (req, res) => {
  try {
    const { teamName, players, manager } = req.body;
    const { teamPhoto } = req.files;

    // Ensure team photo is provided
    if (!req.files || !teamPhoto) {
      return res.status(400).json({
        status: "failed",
        error: "Team photo image is required!",
      });
    }

    // Validate file types (allow only JPEG and PNG)
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(teamPhoto.mimetype)) {
      return res.status(400).json({
        status: "failed",
        error: "Only JPEG and PNG images are allowed for team photo!",
      });
    }

    // Upload team photo to Cloudinary
    const teamPhotoResult = await cloudinary.uploader.upload(
      teamPhoto.tempFilePath,
      {
        use_filename: true,
        folder: "team_photo_images",
      }
    );

    // Ensure players is an array and parse it correctly
    let parsedPlayers = [];
    if (Array.isArray(players)) {
      parsedPlayers = players; // Already an array, no need to parse
    } else if (typeof players === "string") {
      try {
        parsedPlayers = JSON.parse(players); // Attempt to parse it if it's a string
      } catch (error) {
        return res.status(400).json({
          status: "failed",
          error: "Invalid players data. Could not parse JSON.",
        });
      }
    }

    // Validate that players is now an array of objects
    if (!Array.isArray(parsedPlayers) || parsedPlayers.length === 0) {
      return res.status(400).json({
        status: "failed",
        error:
          "Players data is required and must be an array of player objects.",
      });
    }

    // Parse manager from stringified JSON if necessary
    let parsedManager = {};
    if (typeof manager === "string") {
      try {
        parsedManager = JSON.parse(manager); // Parse manager if it was sent as a JSON string
      } catch (error) {
        return res.status(400).json({
          status: "failed",
          error: "Invalid manager data. Could not parse JSON.",
        });
      }
    } else if (typeof manager === "object") {
      parsedManager = manager; // If it's already an object, no need to parse
    }

    // Validate manager fields
    const requiredManagerFields = [
      "name",
      "email",
      "contactAddress",
      "phoneNumber",
      "localGovernment",
    ];
    for (const field of requiredManagerFields) {
      if (!parsedManager[field]) {
        return res.status(400).json({
          status: "failed",
          error: `Manager's ${field} is required.`,
        });
      }
    }

    // Map players to the correct format
    const formattedPlayers = parsedPlayers.map((player) => ({
      name: player.name,
      dob: new Date(player.dob), // Ensure dob is a Date object
      phoneNumber: player.phoneNumber,
      position: player.position,
      jerseyNumber: player.jerseyNumber,
    }));

    // Create a new Team instance with the provided data
    const newTeam = new Team({
      teamName,
      teamPhoto: teamPhotoResult.secure_url, // Save Cloudinary URL
      players: formattedPlayers,
      manager: parsedManager, // Correctly populated manager object
    });

    // Save the team to the database
    await newTeam.save();

    return res.status(201).json({
      message: "Team registered successfully",
      status: "successful",
      team: newTeam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error registering team",
      error: error.message,
    });
  }
};


// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    return res.status(200).json({
      message: "Teams fetched successfully",
      totalTeams: teams.length,
      teams,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching teams",
      error: error.message,
    });
  }
};

// Get a single team by ID
const getSingleTeam = async (req, res) => {
  try {
    const { teamId, teamName } = req.params; // Extract id and teamName from URL parameters

    // Set up the query based on what is provided
    let query = {};

    if (teamId) {
      query = { _id: teamId }; // Use _id if id is provided
    } else if (teamName) {
      query = { teamName }; // Use teamName if id is not provided
    } else {
      return res.status(400).json({
        message: "Either team ID or team name must be provided.",
      });
    }

    // Find the team by the constructed query (either by id or teamName)
    const team = await Team.findOne(query);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json({
      message: "Team fetched successfully",
      team,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching team",
      error: error.message,
    });
  }
};

const getSingleTeamByName = async (req, res) => {
  try {
    const { teamId, teamName } = req.params; // Extract id and teamName from URL parameters

    // Set up the query based on what is provided
    let query = {};

    if (teamId) {
      query = { _id: teamId }; // Use _id if id is provided
    } else if (teamName) {
      query = { teamName }; // Use teamName if id is not provided
    } else {
      return res.status(400).json({
        message: "Either team ID or team name must be provided.",
      });
    }

    // Find the team by the constructed query (either by id or teamName)
    const team = await Team.findOne(query);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json({
      message: "Team fetched successfully",
      team,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching team",
      error: error.message,
    });
  }
};

// Get all players in a specific team
const getPlayersInTeamByName = async (req, res) => {
  try {
    const { teamId, teamName } = req.params; // Extract teamId and teamName from URL parameters

    let team;

    // If teamName is provided, query by teamName
    if (teamName) {
    console.log(teamName);
    
      team = await Team.findOne({ teamName });
    }
    // If teamId is provided, query by _id (MongoDB ObjectId)
    else if (teamId) {
    console.log(teamId);
    
      team = await Team.findById(teamId);
    } else {
      return res.status(400).json({
        message: "Either teamId or teamName must be provided.",
      });
    }

    // If no team is found
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Send the response with the players' data
    return res.status(200).json({
      message: "Players fetched successfully",
      players: team.players, // Return players array
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching players",
      error: error.message,
    });
  }
};

const getPlayersInTeamById = async (req, res) => {
  try {
    const { teamId, teamName } = req.params; // Extract teamId and teamName from URL parameters

    let team;

    // If teamName is provided, query by teamName
    if (teamName) {
      console.log(teamName);

      team = await Team.findOne({ teamName });
    }
    // If teamId is provided, query by _id (MongoDB ObjectId)
    else if (teamId) {
      console.log(teamId);

      team = await Team.findById(teamId);
    } else {
      return res.status(400).json({
        message: "Either teamId or teamName must be provided.",
      });
    }

    // If no team is found
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Send the response with the players' data
    return res.status(200).json({
      message: "Players fetched successfully",
      players: team.players, // Return players array
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching players",
      error: error.message,
    });
  }
};






module.exports = {
  registerTeam,
  getAllTeams,
  getSingleTeam,
  getPlayersInTeamByName,
  getPlayersInTeamById,
  getSingleTeamByName
};
