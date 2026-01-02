
var montantJoueur = 100;  // en milliers FCFA
var montantCasino = 0;
var historique = [];
var enCours = false;

// numeros rouges de la roulette
var numerosRouges = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

// fonction pour generer nombre aleatoire entre min et max
function nbAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// verifier si un nombre est pair
function paire(n) {
    return n % 2 == 0;
}

// formater l'argent en FCFA
function formatSomme(montant) {
    return (montant * 1000).toLocaleString() + " FCFA";
}

// mettre a jour l'affichage de l'argent
function setArgent() {
    document.getElementById("argent-joueur").textContent = formatSomme(montantJoueur);
    document.getElementById("argent-casino").textContent = formatSomme(montantCasino);
}

// ajouter numero a l'historique
function addStory(numero) {
    historique.unshift(numero);
    if (historique.length > 15) {
        historique.pop();
    }
    showStory();
}

// afficher l'historique
function showStory() {
    var container = document.getElementById("liste-historique");
    var html = "";
    
    for (var i = 0; i < historique.length; i++) {
        var num = historique[i];
        var classe = "noir";
        
        if (num == 0) {
            classe = "vert";
        } else if (numerosRouges.indexOf(num) != -1) {
            classe = "rouge";
        }
        
        html += '<span class="num-historique ' + classe + '">' + num + '</span>';
    }
    
    container.innerHTML = html;
}

// afficher le resultat
function afficherMessage(gagne, message) {
    var div = document.getElementById("resultat");
    var p = document.getElementById("message-resultat");
    
    div.className = "resultat";
    if (gagne) {
        div.classList.add("gagne");
    } else {
        div.classList.add("perdu");
    }
    
    p.textContent = message;
}

// fonction principale du jeu
function jouer() {
    if (enCours) return;
    
    // recuperer les valeurs
    var choix = document.getElementById("choix").value;
    var mise = parseInt(document.getElementById("mise").value);
    
    // verifications
    if (mise <= 0 || isNaN(mise)) {
        alert("Entrez une mise valide!");
        return;
    }
    
    if (mise > montantJoueur) {
        alert("Vous n'avez pas assez d'argent! Il vous reste " + formatSomme(montantJoueur));
        return;
    }
    
    // desactiver le bouton
    enCours = true;
    document.getElementById("btn-go").disabled = true;
    
    // cacher ancien resultat
    document.getElementById("resultat").className = "resultat cache";
    
    // animation de la roue
    var roue = document.getElementById("roue");
    roue.classList.add("tourne");
    document.getElementById("numero-tire").textContent = "?";
    
    // tirer un numero apres 2 secondes
    setTimeout(function() {
        // arreter animation
        roue.classList.remove("tourne");
        
        // tirer numero entre 0 et 36
        var numeroTire = nbAleatoire(0, 36);
        document.getElementById("numero-tire").textContent = numeroTire;
        
        // calculer le resultat
        var gagne = false;
        var gain = 0;
        var message = "";
        
        // si le 0 sort, on perd toujours
        if (numeroTire == 0) {
            message = "Le 0 est sorti! Vous perdez " + formatSomme(mise);
            gain = -mise;
        }
        // pari sur pair
        else if (choix == "pair") {
            if (paire(numeroTire)) {
                gagne = true;
                gain = mise;
                message = "Le " + numeroTire + " est pair! Vous gagnez " + formatSomme(gain);
            } else {
                message = "Le " + numeroTire + " est impair. Perdu!";
                gain = -mise;
            }
        }
        // pari sur impair
        else if (choix == "impair") {
            if (!paire(numeroTire)) {
                gagne = true;
                gain = mise;
                message = "Le " + numeroTire + " est impair! Vous gagnez " + formatSomme(gain);
            } else {
                message = "Le " + numeroTire + " est pair. Perdu!";
                gain = -mise;
            }
        }
        // pari sur un numero
        else {
            var numeroParie = parseInt(choix);
            if (numeroTire == numeroParie) {
                gagne = true;
                gain = mise * 35;
                message = "Bravo! Le " + numeroTire + " est sorti! Vous gagnez " + formatSomme(gain);
            } else {
                message = "Le " + numeroTire + " est sorti. Vous aviez parie sur " + numeroParie + ". Perdu!";
                gain = -mise;
            }
        }
        
        // mettre a jour l'argent
        if (gain > 0) {
            montantJoueur += gain;
        } else {
            montantJoueur += gain;  // gain est negatif
            montantCasino += Math.abs(gain);
        }
        
        setArgent();
        addStory(numeroTire);
        afficherMessage(gagne, message);
        
        // reactiver le bouton
        enCours = false;
        document.getElementById("btn-go").disabled = false;
        
        // verifier si le joueur est ruine
        if (montantJoueur <= 0) {
            setTimeout(function() {
                alert("Vous etes ruine! Rechargez la page pour rejouer.");
            }, 500);
        }
        
    }, 2000);
}

// initialisation au chargement de la page
window.onload = function() {
    setArgent();
};
