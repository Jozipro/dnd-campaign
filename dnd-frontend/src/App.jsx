import React, { useState, useEffect } from "react";
import axios from "axios";
import CharacterForm from "./components/CharacterForm";
import CharacterList from "./components/CharacterList";
import CombatTracker from "./components/CombatTracker"; // Import du composant CombatTracker

const App = () => {
    const [characters, setCharacters] = useState([]); // Liste des personnages

    // Fonction pour récupérer les personnages depuis l'API
    const fetchCharacters = async () => {
        try {
            const response = await axios.get("/api/characters");
            setCharacters(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des personnages :", error);
        }
    };

    // useEffect pour charger les personnages au montage du composant
    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <div>
            <h1>Campagne D&D : Gestion des Personnages et Combats</h1>

            {/* Gestion des personnages */}
            <CharacterForm onEditComplete={fetchCharacters} />
            <CharacterList characters={characters} fetchCharacters={fetchCharacters} />

            {/* Tracker des combats */}
            <CombatTracker />
        </div>
    );
};

export default App;
