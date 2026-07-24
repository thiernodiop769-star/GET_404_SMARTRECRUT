# 💼 SmartRecrut

> Plateforme IA de tri de CV pour les responsables RH

##  Problématique
Les responsables RH et les recruteurs perdent des heures à trier manuellement des centaines de CVs non qualifiés. Ce processus fastidieux est souvent sujet à des biais humains involontaires (biais de confirmation, fatigue, préjugés) lors de la sélection des candidats.

## ⚡ Solution
SmartRecrut est un dashboard intelligent qui **score automatiquement les CVs** par rapport à un appel d'offre (fiche de poste) via un "Match Score". Il permet aux recruteurs d'identifier les meilleurs talents en quelques secondes, tout en intégrant un **mode anonyme** pour limiter les biais de recrutement.

## 👥 Équipe
| Membre | Rôle |
|--------|------|
| Claude Emmanuel Tendeng | Chef de produit |
| Thierno Diop | Dev UI |
| Fatoumata Binetou SEYE | Prompt Engineer |
| Caroline Ndiaye | Responsable Impact |
| Abdoulaye SOUMARE | Dev UI |

## 🚀 Démo en ligne
👉 https://smart-recrut-k7t4ixap9-smartrecrut.vercel.app/

## ⚡ Fonctionnalités
- 📊 **Dashboard RH** avec KPIs (CVs analysés, taux de match moyen, postes à pourvoir)
-  **Matching IA** CV ↔ Appel d'offre avec score de correspondance en temps réel
- 🕵️ **Mode Anonyme** (anti-biais de recrutement : masque les noms et photos)
- 🔍 **Filtres dynamiques** par score (>80%, 50-80%, <50%) et statut (À trier, Retenu, Refusé)
- 🧠 **Explicabilité du score (XAI)** : détail des compétences qui justifient le score

## 🛠️ Stack technique
- **Frontend** : React + Tailwind CSS + Vite
- **IA & Workflow** : Dify (Agentique)
- **Génération No-Code** : Bolt.new
- **Déploiement** : Vercel
- **Documentation** : Claude.ai

## ⚖️ Éthique & Lutte contre les biais
Notre MVP intègre une réflexion éthique profonde sur l'IA en RH :
1. **Mode Anonyme** : Permet un tri basé uniquement sur les compétences, en masquant les données démographiques.
2. **Explicabilité (XAI)** : Le score n'est pas une "boîte noire". L'IA explique pourquoi un candidat matche (ex: "Correspondance sur 4/5 compétences clés").
3. **Humain dans la boucle** : L'IA est un assistant de tri, la décision finale de recrutement reste humaine.

---
**Cours GET 409 — Swiss UMEF University — Campus de Dakar — Juillet 2026**
