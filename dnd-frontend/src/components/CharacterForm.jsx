import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CharacterForm = ({ characterToEdit, onEditComplete }) => {
    const [formData, setFormData] = useState(
        characterToEdit || {
            name: '',
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        }
    );

    useEffect(() => {
        if (characterToEdit) {
            setFormData(characterToEdit);
        }
    }, [characterToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (characterToEdit) {
                // Update existing character
                await axios.put(`/api/characters/${characterToEdit.id}`, formData);
                alert("Personnage mis à jour !");
            } else {
                // Create new character
                await axios.post('/api/characters', formData);
                alert("Personnage ajouté !");
            }
            onEditComplete(); // Notify parent to refresh
        } catch (error) {
            console.error("Error saving character:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{characterToEdit ? "Modifier un Personnage" : "Ajouter un Personnage"}</h2>
            <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
            <input type="number" name="strength" placeholder="Force" value={formData.strength} onChange={handleChange} />
            <input type="number" name="dexterity" placeholder="Dexterité" value={formData.dexterity} onChange={handleChange} />
            <input type="number" name="constitution" placeholder="Constitution" value={formData.constitution} onChange={handleChange} />
            <input type="number" name="intelligence" placeholder="Intelligence" value={formData.intelligence} onChange={handleChange} />
            <input type="number" name="wisdom" placeholder="Sagesse" value={formData.wisdom} onChange={handleChange} />
            <input type="number" name="charisma" placeholder="Charisme" value={formData.charisma} onChange={handleChange} />
            <button type="submit">{characterToEdit ? "Mettre à jour" : "Ajouter"}</button>
        </form>
    );
};

export default CharacterForm;
