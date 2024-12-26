import React from "react";
import CharacterForm from "./components/CharacterForm";
import CharacterList from "./components/CharacterList";
import CombatTracker from "./components/CombatTracker"; // Import du composant CombatTracker

const App = () => {
    return (
        <div>
            <h1>Campagne D&D : Gestion des Personnages et Combats</h1>

            {/* Gestion des personnages */}
            <CharacterForm />
            <CharacterList />

            {/* Tracker des combats */}
            <CombatTracker />
        </div>
    );
};

export default App;
