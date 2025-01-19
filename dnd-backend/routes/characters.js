const express = require('express');
const router = express.Router();
const {getCharacters, createCharacter, updateCharacter, deleteCharacter} = 
require('../controllers/characterController');

//Récupère, Ajoute, Modifie et efface un nouveau/ personnage selon id
router.get('/', getCharacters);
router.post('/', createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

module.exports=router;
