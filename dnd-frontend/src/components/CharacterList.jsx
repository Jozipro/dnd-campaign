import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [editCharacter, setEditCharacter] = useState(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const response = await axios.get('/api/characters');
            console.log("Données reçues :", response.data); // Traces des données, doivent être un tableau
            setCharacters(response.data);
        } catch (error) {
            console.error("Error fetching characters:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?")) return;

        try {
            await axios.delete(`/api/characters/${id}`);
            fetchCharacters(); // Refresh list
        } catch (error) {
            console.error("Error deleting character:", error);
        }
    };

    const handleEdit = (character) => {
        setEditCharacter(character); // Set character for editing
    };

    return (
        <div>
            <h2>Liste des Personnages</h2>
            <ul>
                {characters.map((char) => (
                    <li key={char.id}>
                        {char.name} (Force : {char.strength}, Dextérité : {char.dexterity})
                        <button onClick={() => handleEdit(char)}>Modifier</button>
                        <button onClick={() => handleDelete(char.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharacterList;
