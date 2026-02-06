// ========================================
// VARIABLES GLOBALES
// ========================================

// Stocke l'historique des calculs
let history = [];

// Active/désactive les sons de la calculatrice
let soundEnabled = true;

// Mode d'angle pour les fonctions trigonométriques ('deg' ou 'rad')
let angleMode = 'deg';

// ========================================
// THÈMES DE COULEURS
// ========================================

// Définition des thèmes de couleurs prédéfinis
const themes = {
    purple: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
    blue: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
    red: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
    orange: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    pink: 'linear-gradient(135deg, #ec4899 0%, #9f1239 100%)',
    yellow: 'linear-gradient(135deg, #facc15 0%, #a16207 100%)',
    white: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
};

// ========================================
// FONCTIONS DE GESTION DU MODAL DE COULEUR
// ========================================

/**
 * Ouvre le modal de sélection de couleur
 */
function openColorPicker() {
    document.getElementById('color-modal').classList.remove('hidden');
    if (soundEnabled) playSound();
}

/**
 * Ferme le modal de sélection de couleur
 */
function closeColorPicker() {
    document.getElementById('color-modal').classList.add('hidden');
    if (soundEnabled) playSound();
}

/**
 * Change le thème de couleur de la calculatrice
 * @param {string} theme - Le nom du thème à appliquer
 */
function changeThemeColor(theme) {
    const calculator = document.getElementById('calculator-container');
    calculator.style.background = themes[theme];
    
    // Sauvegarde le thème dans le navigateur
    localStorage.setItem('calculatorTheme', themes[theme]);
    
    closeColorPicker();
    if (soundEnabled) playSound();
}

/**
 * Applique une couleur personnalisée choisie par l'utilisateur
 */
function applyCustomColor() {
    const color = document.getElementById('custom-color').value;
    
    // Crée un dégradé avec la couleur choisie
    const gradient = `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -30)} 100%)`;
    
    const calculator = document.getElementById('calculator-container');
    calculator.style.background = gradient;
    
    // Sauvegarde la couleur personnalisée
    localStorage.setItem('calculatorTheme', gradient);
    
    closeColorPicker();
    if (soundEnabled) playSound();
}

// ========================================
// GESTION DU MENU LATÉRAL
// ========================================

/**
 * Ouvre/ferme le menu latéral
 */
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const hamburger = document.getElementById('hamburger');
    
    // Bascule la visibilité du menu
    menu.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
    hamburger.classList.toggle('hamburger-open');
    
    if (soundEnabled) playSound();
}

/**
 * Change le mode de la calculatrice (standard ou scientifique)
 * @param {string} mode - 'basic' pour standard, 'scientific' pour scientifique
 */
function switchMode(mode) {
    const basicCalc = document.getElementById('basic-calculator');
    const scientificCalc = document.getElementById('scientific-calculator');
    const title = document.getElementById('calc-title');
    const btnBasic = document.getElementById('btn-basic');
    const btnScientific = document.getElementById('btn-scientific');
    
    if (mode === 'basic') {
        // Afficher mode standard
        basicCalc.classList.remove('hidden');
        scientificCalc.classList.add('hidden');
        title.textContent = 'Calculatrice Standard';
        
        // Mettre à jour les boutons
        btnBasic.classList.add('bg-orange-500');
        btnBasic.classList.remove('bg-gray-700');
        btnScientific.classList.add('bg-gray-700');
        btnScientific.classList.remove('bg-orange-500');
    } else {
        // Afficher mode scientifique
        basicCalc.classList.add('hidden');
        scientificCalc.classList.remove('hidden');
        title.textContent = 'Calculatrice Scientifique';
        
        // Mettre à jour les boutons
        btnScientific.classList.add('bg-orange-500');
        btnScientific.classList.remove('bg-gray-700');
        btnBasic.classList.add('bg-gray-700');
        btnBasic.classList.remove('bg-orange-500');
    }
    
    if (soundEnabled) playSound();
}

// ========================================
// GESTION DU SON
// ========================================

/**
 * Joue un son de bip court
 */
function playSound() {
    if (!soundEnabled) return;
    
    // Crée un contexte audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configuration du son
    oscillator.frequency.value = 800;  // Fréquence en Hz
    oscillator.type = 'sine';  // Type d'onde
    
    // Diminution progressive du volume
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // Jouer le son pendant 0.1 seconde
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ========================================
// GESTION DE L'HISTORIQUE
// ========================================

/**
 * Ajoute un calcul à l'historique
 * @param {string} calculation - L'opération effectuée
 * @param {string} result - Le résultat de l'opération
 */
function addToHistory(calculation, result) {
    // Ajoute au début du tableau
    history.unshift({ 
        calculation, 
        result, 
        timestamp: new Date() 
    });
    
    // Limite l'historique à 20 éléments
    if (history.length > 20) history.pop();
    
    updateHistoryDisplay();
}

/**
 * Met à jour l'affichage de l'historique dans le menu
 */
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    // Si l'historique est vide
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Aucun calcul récent</p>';
        return;
    }
    
    // Génère le HTML pour chaque élément de l'historique
    historyList.innerHTML = history.map(item => `
        <div class="history-item bg-gray-700 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-600 transition-all duration-300 hover:scale-102 hover:shadow-lg" 
             onclick="calculator.loadFromHistory('${item.result}')">
            <div class="text-gray-400 text-xs mb-1">${item.calculation}</div>
            <div class="text-white text-base font-bold">= ${item.result}</div>
        </div>
    `).join('');
}

/**
 * Efface tout l'historique des calculs
 */
function clearHistory() {
    history = [];
    updateHistoryDisplay();
    if (soundEnabled) playSound();
}

// ───────────────────────────────────────────────
// FONCTIONS MATHÉMATIQUES SUPPLÉMENTAIRES
// ───────────────────────────────────────────────

// Valeur absolue
function valeurAbsolue(x) {
    return x >= 0 ? x : -x;
}

// Racine cubique
function racineCubique(x) {
    return Math.cbrt(x);           // version moderne et claire
    // ou : return Math.pow(x, 1/3);   // version classique
}

// Puissance n^x (version boucle pour les entiers positifs)
function puissance(n, exposant) {
    if (!Number.isInteger(exposant) || exposant < 0) {
        return Math.pow(n, exposant); // on passe à Math.pow pour les cas complexes
    }
    let resultat = 1;
    for (let i = 0; i < exposant; i++) {
        resultat *= n;
    }
    return resultat;
}

// Cube (n³) — très rapide
function cube(n) {
    return n * n * n;
}

// Factorielle (déjà présente, mais on la rend plus visible)
function factorielle(n) {
    if (n < 0 || !Number.isInteger(n)) {
        alert("Veuiller inserer un entiers positifs ou zéro");
        return null;
    }
    if (n === 0 || n === 1) return 1;
    
    let resultat = 1;
    for (let i = 2; i <= n; i++) {
        resultat *= i;
    }
    return resultat;
}

// Arrangement A(n,k) = n! / (n-k)!
function arrangement(n, k) {
    if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k)) {
        alert("Veuilllez inserer les entiers, k ≥ 0 et k ≤ n");
        return null;
    }
    return factorielle(n) / factorielle(n - k);
}

// Combinaison C(n,k) = n! / (k! × (n-k)!)
function combinaison(n, k) {
    if (k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k)) {
        alert("Veuiller inserer les entiers, k ≥ 0 et k ≤ n");
        return null;
    }
    return factorielle(n) / (factorielle(k) * factorielle(n - k));
}

// ========================================
// CLASSE CALCULATRICE
// ========================================

class Calculator {
    /**
     * Constructeur de la calculatrice
     * @param {HTMLElement} previousOperandElement - Élément pour l'opération précédente
     * @param {HTMLElement} currentOperandElement - Élément pour le nombre actuel
     */
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    /**
     * Réinitialise la calculatrice
     */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
        if (soundEnabled) playSound();
    }

    /**
     * Supprime le dernier chiffre saisi
     */
    delete() {
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        
        this.updateDisplay();
        if (soundEnabled) playSound();
    }

    /**
     * Ajoute un nombre ou un point décimal
     * @param {string} number - Le chiffre ou le point à ajouter
     */
    appendNumber(number) {
        // Empêche d'ajouter plusieurs points décimaux
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Remplace le 0 initial par le nouveau chiffre
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        this.updateDisplay();
        if (soundEnabled) playSound();
    }

    /**
     * Sélectionne une opération mathématique
     * @param {string} operation - L'opération (+, -, ×, ÷, ^)
     */
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        // Si une opération est déjà en cours, calcule d'abord
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
        if (soundEnabled) playSound();
    }

    /**
     * Effectue le calcul
     */
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // Vérification des nombres valides
        if (isNaN(prev) || isNaN(current)) return;
        
        let calculationString = `${prev} ${this.operation} ${current}`;
        
        // Effectue l'opération selon le type
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('La Division par zéro est impossible !');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                calculationString = `${prev}^${current}`;
                break;
            default:
                return;
        }
        
        // Arrondit à 10 décimales pour éviter les erreurs de virgule flottante
        computation = Math.round(computation * 10000000000) / 10000000000;
        
        // Ajoute à l'historique
        addToHistory(calculationString, computation.toString());
        
        // Met à jour l'affichage
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
        if (soundEnabled) playSound();
    }
    
    /**
     * Effectue une fonction scientifique
     * @param {string} func - Le nom de la fonction (sin, cos, tan, etc.)
     */
    scientificFunction(func) {
        let current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        let calculationString;
        
        // Conversion degrés -> radians si nécessaire
        const toRadians = (deg) => deg * (Math.PI / 180);
        const angleValue = angleMode === 'deg' ? toRadians(current) : current;
        
        // Exécute la fonction appropriée
        switch(func) {
            case 'sin':
                result = Math.sin(angleValue);
                calculationString = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(angleValue);
                calculationString = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(angleValue);
                calculationString = `tan(${current})`;
                break;
            case 'exp':
                result = Math.exp(current);
                calculationString = `e^${current}`;
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Veuillez insérer un nombre positif pour ln ! ');
                    return;
                }
                result = Math.log(current);
                calculationString = `ln(${current})`;
                break;
            case 'log':
                if (current <= 0) {
                    alert('Logarithme impossible pour les nombres négatifs ou zéro');
                    return;
                }
                result = Math.log10(current);
                calculationString = `log(${current})`;
                break;
            case 'sqrt':
                if (current < 0) {
                    alert('Veuiller inserer un nombre positif pour la racine carrée');
                    return;
                }
                result = Math.sqrt(current);
                calculationString = `√(${current})`;
                break;
            case 'square':
                result = current * current;
                calculationString = `${current}²`;
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    alert('Factorielle est uniquement pour les entiers positifs');
                    return;
                }
                result = this.factorial(current);
                calculationString = `${current}!`;
                break;
            case 'negate':
                result = -current;
                calculationString = `-(${current})`;
                break;
            case 'percent':
                result = current / 100;
                calculationString = `${current}%`;
                break;
            case 'abs':
                result = valeurAbsolue(current);
                calculationString = `|${current}|`;
            break;

            case 'cbrt':
                result = racineCubique(current);
                calculationString = `∛(${current})`;
                break;

            case 'cube':
                result = cube(current);
                calculationString = `(${current})³`;
                break;

            case 'power':
                // Pour n^x → on utilise déjà l'opérateur ^ dans chooseOperation
                // donc ce case peut rester vide ou servir de rappel
                return;

            case 'acos':
                if (current < -1 || current > 1) {
                    alert("arccos : domaine [-1 ; 1]");
                    return;
                }
                result = Math.acos(angleValue);
                calculationString = `arccos(${current})`;
                break;

            case 'asin':
                if (current < -1 || current > 1) {
                    alert("arcsin : domaine [-1 ; 1]");
                    return;
                }
                result = Math.asin(angleValue);
                calculationString = `arcsin(${current})`;
                break;

            case 'atan':
                result = Math.atan(angleValue);
                calculationString = `arctan(${current})`;
                break;

            case 'factorial':
                result = factorielle(current);
                if (result === null) return;
                calculationString = `${current}!`;
                break;

            case 'combinaison':
                let k = prompt("Veuillez entrer la valeur de k pour C(n,k) :");
                k = parseInt(k);
                if (isNaN(k)) return;
                result = combinaison(current, k);
                if (result === null) return;
                calculationString = `C(${current},${k})`;
                break;

            case 'arrangement':
                let k2 = prompt("Veuiller entrer la valeur de k pour A(n,k) :");
                k2 = parseInt(k2);
                if (isNaN(k2)) return;
                result = arrangement(current, k2);
                if (result === null) return;
                calculationString = `A(${current},${k2})`;
                break;
            default:
                return;
        }
        
        // Arrondit le résultat
        result = Math.round(result * 10000000000) / 10000000000;
        
        // Ajoute à l'historique
        addToHistory(calculationString, result.toString());
        
        // Met à jour l'affichage
        this.currentOperand = result.toString();
        this.updateDisplay();
        if (soundEnabled) playSound();
    }
    
    /**
     * Calcule la factorielle d'un nombre
     * @param {number} n - Le nombre dont on veut la factorielle
     * @returns {number} La factorielle de n
     */
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
   
    insertConstant(constant) {
        switch(constant) {
            case 'pi':
                this.currentOperand = Math.PI.toString();
                break;
        }
        this.updateDisplay();
        if (soundEnabled) playSound();
    }
    
   
    loadFromHistory(value) {
        this.currentOperand = value;
        this.updateDisplay();
        toggleMenu();  // Ferme le menu après sélection
    }

    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Formate avec des espaces pour les milliers (format français)
            integerDisplay = integerDigits.toLocaleString('fr-FR', {
                maximumFractionDigits: 0
            });
        }
        
        // Ajoute la partie décimale si elle existe
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    /**
     * Met à jour l'affichage de la calculatrice
     */
    updateDisplay() {
        // Affiche le nombre actuel
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        // Affiche l'opération en cours si elle existe
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// ========================================
// INITIALISATION
// ========================================

// Récupère les éléments d'affichage
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

// Crée l'instance de la calculatrice
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// ========================================
// ÉVÉNEMENTS
// ========================================

/**
 * Gère le toggle du son
 */
document.getElementById('sound-toggle').addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
});

/**
 * Gère le changement de mode d'angle (degrés/radians)
 */
document.getElementById('angle-mode').addEventListener('change', (e) => {
    angleMode = e.target.value;
});

/**
 * Support du clavier pour la calculatrice
 */
document.addEventListener('keydown', (e) => {
    // Nombres 0-9
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
    } 
    // Point décimal
    else if (e.key === '.') {
        calculator.appendNumber('.');
    } 
    // Addition
    else if (e.key === '+') {
        calculator.chooseOperation('+');
    } 
    // Soustraction
    else if (e.key === '-') {
        calculator.chooseOperation('-');
    } 
    // Multiplication
    else if (e.key === '*') {
        calculator.chooseOperation('×');
    } 
    // Division
    else if (e.key === '/') {
        e.preventDefault();  // Empêche la recherche rapide du navigateur
        calculator.chooseOperation('÷');
    } 
    // Égal (Enter ou =)
    else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
    } 
    // Supprimer (Backspace)
    else if (e.key === 'Backspace') {
        calculator.delete();
    } 
    // Tout effacer (Escape)
    else if (e.key === 'Escape') {
        calculator.clear();
    }
});

// ========================================
// CHARGEMENT DU THÈME SAUVEGARDÉ
// ========================================

/**
 * Charge le thème de couleur sauvegardé au démarrage
 */
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme) {
        const calculator = document.getElementById('calculator-container');
        calculator.style.background = savedTheme;
    }

});


