const db = require('../models/db');

//Demander la liste des personnage
const getCharacters = (req, res) => {
    db.query('SELECT * FROM characters', (err, results) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json(results);
    });
};

//Créer un personnage
const createCharacter = (req, res) => {
    const {name, strength, dexterity, constitution, intelligence, wisdom, charisma} = req.body;
    const query = 'INSERT INTO characters (name, strength, dexterity, constitution, intelligence, wisdom, charisma) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, strength, dexterity, constitution, intelligence, wisdom, charisma];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.status(201).json({id: result.insertID, ...req.body});
    });
};

// Mettre à jour un personnage
const updateCharacter = (req, res) => {
    const { id } = req.params;
    const { name, strength, dexterity, constitution, intelligence, wisdom, charisma } = req.body;

    const query = `
        UPDATE characters
        SET name = ?, strength = ?, dexterity = ?, constitution = ?, intelligence = ?, wisdom = ?, charisma = ?
        WHERE id = ?
    `;
    const values = [name, strength, dexterity, constitution, intelligence, wisdom, charisma, id];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Character not found" });
        }
        res.status(200).json({ message: "Character updated successfully" });
    });
};

// Supprimer un personnage
const deleteCharacter = (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM characters WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Character not found" });
        }
        res.status(200).json({ message: "Character deleted successfully" });
    });
};

module.exports = {
    getCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter
};
