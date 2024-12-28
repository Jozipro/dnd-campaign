import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CombatTracker = () => {
    const [combatId, setCombatId] = useState(null); // ID du combat actif
    const [participants, setParticipants] = useState([]); // Liste des participants
    const [newParticipant, setNewParticipant] = useState({ name: '', initiative: 0, hp: 10 }); // Données du formulaire
    const [editParticipantId, setEditParticipantId] = useState(null); // ID du participant à modifier
    const [editHp, setEditHp] = useState(""); // PV pour modification
    const [editInitiative, setEditInitiative] = useState(""); // Initiative pour modification
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0); // Index du tour actuel

    // Récupérer les participants du combat actif
    const fetchParticipants = async () => {
        try {
            if (!combatId) return;
            const response = await axios.get(`/api/combats/${combatId}/participants`);
            setParticipants(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des participants :", error);
        }
    };

    // Ajouter un participant
    const handleAddParticipant = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/combats/${combatId}/participants`, newParticipant);
            setNewParticipant({ name: '', initiative: 0, hp: 10 }); // Réinitialise le formulaire
            fetchParticipants(); // Rafraîchit la liste
        } catch (error) {
            console.error("Erreur lors de l'ajout du participant :", error);
        }
    };

    // Modifier un participant
    const handleEditParticipant = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/combats/participants/${editParticipantId}`, {
                hp: editHp || undefined,
                initiative: editInitiative || undefined,
            });
            fetchParticipants(); // Rafraîchit la liste
            setEditParticipantId(null); // Réinitialise le formulaire
            setEditHp("");
            setEditInitiative("");
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
        }
    };

    // Mettre à jour les PV d'un participant
    const handleUpdateHP = async (id, hp) => {
        try {
            await axios.put(`/api/combats/participants/${id}`, { hp });
            fetchParticipants(); // Rafraîchit la liste
        } catch (error) {
            console.error("Erreur lors de la mise à jour des PV :", error);
        }
    };

    // Supprimer un participant
    const handleDeleteParticipant = async (id) => {
        try {
            await axios.delete(`/api/combats/participants/${id}`);
            fetchParticipants(); // Rafraîchit la liste
        } catch (error) {
            console.error("Erreur lors de la suppression du participant :", error);
        }
    };

    // Créer un nouveau combat
    const handleCreateCombat = async () => {
        try {
            const response = await axios.post('/api/combats', { name: 'Nouveau Combat' });
            setCombatId(response.data.id); // Définit le combat actif
        } catch (error) {
            console.error("Erreur lors de la création du combat :", error);
        }
    };

    // Supprimer le combat actif
    const handleDeleteCombat = async () => {
        try {
            await axios.delete(`/api/combats/${combatId}`);
            setCombatId(null); // Réinitialise le combat actif
            setParticipants([]); // Vide la liste des participants
            alert("Combat supprimé !");
        } catch (error) {
            console.error("Erreur lors de la suppression du combat :", error);
        }
    };

    // Charger les participants au changement de combat
    useEffect(() => {
        fetchParticipants();
    }, [combatId]);

    return (
        <div>
            <h2>Tracker de Combat</h2>

            {/* Création ou suppression de combat */}
            {!combatId ? (
                <button onClick={handleCreateCombat}>Créer un nouveau combat</button>
            ) : (
                <button onClick={handleDeleteCombat}>Supprimer le combat</button>
            )}

            {/* Ajouter un participant */}
            {combatId && (
                <>
                    <form onSubmit={handleAddParticipant}>
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newParticipant.name}
                            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Initiative"
                            value={newParticipant.initiative}
                            onChange={(e) => setNewParticipant({ ...newParticipant, initiative: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="PV"
                            value={newParticipant.hp}
                            onChange={(e) => setNewParticipant({ ...newParticipant, hp: e.target.value })}
                            required
                        />
                        <button type="submit">Ajouter</button>
                    </form>

                    {/* Liste des participants */}
                    <ul>
                        {participants.map((p, index) => (
                            <li
                                key={p.id}
                                style={{
                                    fontWeight: index === currentTurnIndex ? "bold" : "normal",
                                    color: index === currentTurnIndex ? "green" : "black",
                                }}
                            >
                                {p.name} (Init: {p.initiative}, PV: {p.hp})
                                <button onClick={() => handleUpdateHP(p.id, p.hp - 1)}>-1 PV</button>
                                <button onClick={() => handleUpdateHP(p.id, p.hp + 1)}>+1 PV</button>
                                <button onClick={() => setEditParticipantId(p.id)}>Modifier</button>
                                <button onClick={() => handleDeleteParticipant(p.id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>

                    {/* Modification d'un participant */}
                    {editParticipantId && (
                        <form onSubmit={handleEditParticipant}>
                            <h3>Modifier un participant</h3>
                            <label>
                                PV:
                                <input
                                    type="number"
                                    value={editHp}
                                    onChange={(e) => setEditHp(e.target.value)}
                                />
                            </label>
                            <label>
                                Initiative :
                                <input
                                    type="number"
                                    value={editInitiative}
                                    onChange={(e) => setEditInitiative(e.target.value)}
                                />
                            </label>
                            <button type="submit">Enregistrer</button>
                            <button onClick={() => setEditParticipantId(null)}>Annuler</button>
                        </form>
                    )}

                    {/* Tour suivant */}
                    <button onClick={() => setCurrentTurnIndex((prev) => (prev + 1) % participants.length)}>
                        Tour suivant
                    </button>
                </>
            )}
        </div>
    );
};

export default CombatTracker;
