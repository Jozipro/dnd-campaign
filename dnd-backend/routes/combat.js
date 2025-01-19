const express = require('express');
const router = express.Router();
const {
    createCombat,
    addParticipant,
    getCombatParticipants,
    updateParticipant,
    deleteParticipant,
    deleteCombat
} = require('../controllers/combatController');

router.post('/', createCombat);
router.post('/:combatId/participants', addParticipant);
router.get('/:combatId/participants', getCombatParticipants);
router.put('/participants/:id', updateParticipant);
router.delete('/participants/:id', deleteParticipant);
router.delete('/:id/', deleteCombat);

module.exports = router;
