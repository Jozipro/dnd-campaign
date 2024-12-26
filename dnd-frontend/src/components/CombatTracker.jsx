import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CombatTracker = () => {
    const [combatId, setCombatId] = useState(null); // Active Combat ID
    const [participants, setParticipants] = useState([]); // Participants list
    const [newParticipant, setNewParticipant] = useState({ name: '', initiative: 0, hp: 10 }); // Form data

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
            setNewParticipant({ name: '', initiative: 0, hp: 10 }); // Form rerender
            fetchParticipants(); // Refresh list
        } catch (error) {
            console.error("Erreur lors de l'ajout du participant :", error);
        }
    };

    // Modifier les PV d'un participant
    const handleUpdateHP = async (id, hp) => {
        try {
            await axios.put(`/api/combats/participants/${id}`, { hp });
            fetchParticipants(); // Refresh list
        } catch (error) {
            console.error("Erreur lors de la mise à jour des PV :", error);
        }
    };

    // Sort participants by initiative score
    useEffect(() => {
        fetchParticipants();
    }, [combatId]);

    return (
        <div>
            <h2>Tracker de Combat</h2>

            {/* Fight creation*/}
            {!combatId && (
                <button onClick={async () => {
                    try {
                        const response = await axios.post('/api/combats', { name: 'Nouveau Combat' });
                        setCombatId(response.data.id); // Give active fight and ID
                    } catch (error) {
                        console.error("Erreur lors de la création du combat :", error);
                    }
                }}>
                    Créer un nouveau combat
                </button>
            )}

<button onClick={async () => {
    try {
        await axios.delete(`/api/combats/${combatId}`);
        setCombatId(null); // Réinitialise le combat actif
        setParticipants([]); // Vide la liste des participants
        alert("Combat supprimé !");
    } catch (error) {
        console.error("Erreur lors de la suppression du combat :", error);
    }
}}>
    Supprimer le combat
</button>



            {/* Add a participant */}
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
                        {participants.map((participant) => (
                            <li key={participant.id}>
                                {participant.name} (Init: {participant.initiative}, PV: {participant.hp})
                                <button onClick={() => handleUpdateHP(participant.id, participant.hp - 1)}>-1 PV</button>
                                <button onClick={() => handleUpdateHP(participant.id, participant.hp + 1)}>+1 PV</button>
                            </li>
                        ))}
                    </ul>

                    {/*Supprimer un participant */}
                    <ul>
    {participants.map((participant) => (
        <li key={participant.id}>
            {participant.name} (Init: {participant.initiative}, PV: {participant.hp})
            <button onClick={async () => {
                try {
                    await axios.delete(`/api/combats/participants/${participant.id}`);
                    fetchParticipants(); // Rafraîchit la liste
                } catch (error) {
                    console.error("Erreur lors de la suppression du participant :", error);
                }
            }}>
                Supprimer
            </button>
        </li>
    ))}
</ul>

                </>
            )}


        </div>
    );
};

export default CombatTracker;
