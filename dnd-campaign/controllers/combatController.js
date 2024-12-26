const db = require('../models/db');

// Initiate new combat
const createCombat = (req, res) => {
    const {name} = req.body;


const query = 'INSERT INTO combats (name) VALUES (?)';
db.query(query, [name], (err, result) => {
    if (err) {
        return res.status(500).json({error: err.message});
    }
res.status(201).json({id: result.insertId, name});
});
};

//Delete a combat
const deleteCombat = (req, res) => {
    const {id} = req.params;

    //Supprime les participants liés au combat
    const deleteParticipantsQuery = 'DELETE FROM participants WHERE combat_id = ?';
    db.query(deleteParticipantsQuery), [id], (err) => {
        if (err) {
            return res.status(500).json({error:err.message});
        }

        // Delete a combat
const deleteCombat = (req, res) => {
    const { id } = req.params;

    // Supprime les participants liés au combat
    const deleteParticipantsQuery = 'DELETE FROM participants WHERE combat_id = ?';
    db.query(deleteParticipantsQuery, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Supprime le combat
        const deleteCombatQuery = 'DELETE FROM combats WHERE id = ?';
        db.query(deleteCombatQuery, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Combat not found' });
            }
            res.status(200).json({ message: 'Combat deleted successfully' });
        });
    });
};

    }
}

// Add a fighter to combat
const addParticipant= (req, res) => {
    const {combatId} = req.params;
    const {name, initiative, hp} = req.body;
    
    const query = 'INSERT INTO participants (combat_id, name, initiative, hp) VALUES (?, ?, ?, ?)';

    db.query(query, [combatId, name, initiative, hp], (err, result) => {
        if (err){
            return res.status(500).json({error: err.message});
        }
        res.status(201).json({id:result.insertId, name, initiative, hp});
    });
};

// Get combat fighters list
const getCombatParticipants = (req, res) => {
    const {combatId} = req.params;

    const query = 'SELECT * FROM participants WHERE combat_id = ? ORDER by initiative DESC';
    db.query(query, [combatId], (err, results)=> {
        if(err){
            return res.status(500).json({error : err.message});
        }
        res.status(200).json(results);
    });
} ;

// Update a fighter
const updateParticipant = (req, res)=> {
    const {id} = req.params;
    const {initiative, hp} = req.body;

    const query = 'UPDATE participants set initiative = ?, hp = ? WHERE id = ?';
    db.query(query, [initiative, hp, id], (err, result) =>{
        if(err){
            return res.status(500).json({error:err.message}); 
        }
        if (result.affectedRows ===0) {
            return res.status(404).json({error: 'Participant not found'});
        }
        res.status(200).json({message:'Participant updated successfully'});
    });
};

//Delete a participant
const deleteParticipant = (req, res) => {
    const {id} = req.params;

    const query = 'Delete from participants where id = ?';
    db.query(query, [id], (err, result) => {
        if (err){
            return res.status(500).json({error: err.message});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Participant not found'});
        }
        res.status(200).json({message: 'Participant deleted successfully'});
    });
};

module.exports = {
    createCombat,
    addParticipant,
    getCombatParticipants,
    updateParticipant,
    deleteParticipant,
    deleteCombat
};
