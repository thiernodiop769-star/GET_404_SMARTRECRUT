# 📝 Journal des Prompts — SmartRecrut

**Projet :** SmartRecrut (Plateforme IA de tri de CV)  
**Cours :** GET 409 — Swiss UMEF University  
**Équipe :** Claude Emmanuel Tendeng, Thierno Diop, Fatoumata Binetou SEYE, Caroline Ndiaye, Abdoulaye SOUMARE  
**Date :** Juillet 2026

---

## 🎯 Prompt 1 — Initialisation du MVP (Génération du squelette)
**Outil :** Bolt.new  
**Technique :** Prompt Structuré  
**Objectif :** Générer le code initial complet de l'application (3 pages, design, données fictives) en une seule requête.

**Prompt utilisé :**
> "Crée une application web complète appelée SmartRecrut.
> CONTEXTE: SmartRecrut est une plateforme numérique qui permet aux responsables RH de trier automatiquement les CVs et de sélectionner les meilleurs profils en les comparant à un appel d'offre via un score de correspondance (Match Score).
> PAGES À CRÉER:
> 1. ACCUEIL: Header avec logo , Hero 'Recrutez 3x plus vite avec le matching IA', 2 CTA, section stats (1240 CVs, 85% match, 12 postes).
> 2. CANDIDATS: Liste de 6 candidats (Amina Diallo, Ousmane Ba, etc.) avec Score de Match, statut, et filtres (Tous, >80%, 50-80%, <50%).
> 3. CONTACT RH: Formulaire complet + adresse Immeuble Le Diamant, Plateau, Dakar.
> DESIGN: Couleur principale #1E3A8A, Accent #F97316, Police Inter, style Dashboard SaaS moderne.
> STACK: React + Tailwind CSS + Vite."

**Résultat :** ✅ Le MVP de base a été généré en 45 secondes avec les 3 pages navigables et les données fictives correctement intégrées.

---

## 🎨 Prompt 2 — Ajout d'une fonctionnalité clé (Mode Anonyme)
**Outil :** Bolt.new  
**Technique :** Prompt Correctif / Itératif  
**Objectif :** Ajouter une fonctionnalité "Mode Anonyme" pour masquer les noms des candidats et lutter contre les biais de recrutement, sans casser le code existant.

**Prompt utilisé :**
> "Sur la page Candidats, ajoute un bouton 'Mode Anonyme' en haut à droite de la liste.
> Quand on clique dessus :
> - Le nom et la photo des candidats sont masqués (remplacés par 'Candidat #1', 'Candidat #2').
> - Seules les compétences et le score de match restent visibles.
> - Le bouton change de couleur (devient orange) pour indiquer que le mode est actif.
> Ne modifie PAS le layout général, concentre-toi uniquement sur la logique d'affichage des cartes."

**Résultat :** ✅ La fonctionnalité a été ajoutée avec succès. Le toggle fonctionne et permet de visualiser les candidats de manière impartiale.

---

##  Prompt 3 — Débogage des filtres (Correction d'erreur)
**Outil :** Bolt.new  
**Technique :** Prompt Diagnose  
**Objectif :** Corriger un bug où les filtres de score (>80%, etc.) ne filtraient pas réellement la liste des candidats.

**Prompt utilisé :**
> "Les filtres de la page Candidats ne fonctionnent pas. Quand je clique sur 'Score >80%', toutes les cartes restent affichées au lieu de ne montrer que les scores supérieurs à 80%.
> Vérifie la logique de filtrage dans le composant de la liste. 
> Corrige uniquement la fonction de filtrage sans changer le design des cartes."

**Résultat :** ✅ Bolt a identifié que la variable d'état du filtre n'était pas liée à la fonction `filter()` du tableau. Le bug a été corrigé en 1 itération.

---

## ️ Prompt 4 — Analyse Éthique de l'IA en RH
**Outil :** Claude.ai  
**Technique :** Chain-of-Thought (CoT)  
**Objectif :** Rédiger la note éthique du projet en identifiant les risques réels de l'IA dans le recrutement et les garde-fous à implémenter.

**Prompt utilisé :**
> "Tu es un expert en éthique de l'IA et en DRH. Analyse les enjeux éthiques de notre MVP SmartRecrut (tri de CV par IA). Raisonne étape par étape.
> ÉTAPE 1 — BIAIS ALGORITHMIQUES : Quels sont les risques que l'IA pénalise involontairement certains candidats (genre, origine, nom) ? Comment l'interface peut atténuer cela ?
> ÉTAPE 2 — TRANSPARENCE (XAI) : Le 'Score de Match' est-il une boîte noire ? Comment expliquer pourquoi un CV a 90% de match ?
> ÉTAPE 3 — DONNÉES ET RGPD : Quelles sont les obligations légales concernant le stockage des CVs ?
> Pour chaque étape : identifie 1 risque concret + 1 garde-fou à implémenter dans l'UI."

**Résultat :** ✅ Claude a produit une analyse structurée en 3 parties. Nous avons utilisé ces insights pour justifier notre "Mode Anonyme" et ajouter une section "Explicabilité" (XAI) dans le README.

---

### 💡 Bilan de l'utilisation de l'IA
L'utilisation de **Bolt.new** nous a permis de passer de l'idée au MVP fonctionnel en moins de 2 heures. La règle d'or **"1 prompt = 1 modification"** a été cruciale pour éviter de casser le code. **Claude.ai** a été indispensable pour la réflexion stratégique et éthique, transformant un simple outil technique en un projet responsable adapté au contexte RH.