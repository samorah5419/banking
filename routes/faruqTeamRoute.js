const express = require("express");
const router = express.Router();
const {
  registerTeam,
  getAllTeams,
  getSingleTeam,
  getPlayersInTeamByName,
  getSingleTeamByName,
  getPlayersInTeamById,
}  = require("../controllers/faruqTeamController");

router.post("/team/register", registerTeam);

router.get("/team/all", getAllTeams);

router.get("/team/:teamId/id_search", getSingleTeam); 
router.get("/team/:teamName/name_search", getSingleTeamByName); 

router.get("/team/:teamName/name_search/players", getPlayersInTeamByName);
router.get("/team/:teamId/id_search/players", getPlayersInTeamById); 

module.exports = router;
