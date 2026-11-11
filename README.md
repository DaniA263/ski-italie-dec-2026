# 🎿 Ski Italie — 13 → 17 décembre 2026

App de coordination pour un groupe de 5 personnes qui organise un voyage de ski
dans les stations italiennes accessibles depuis Milan.

## Ce que c'est

Un site statique (3 fichiers, aucun serveur) qui sert de **mémoire partagée du projet**.
Chacun des 5 participants peut s'y connecter depuis son téléphone et voir où en est
le projet, réserver ce qui le concerne, et cocher ses tâches.

## Contenu

| Section | Rôle |
|---|---|
| Tableau de bord | Compte à rebours, avancement, alertes budget et saison |
| Tâches | 14 tâches pré-remplies, chacune avec un responsable et une consigne détaillée |
| Budget | Suivi par poste, alerte quand on dépasse 800 €/personne |
| Où réserver | 45 liens directs : vols, logement, voiture, forfaits, matériel, activités |
| Vote | Classement des stations par le groupe (3 / 2 / 1 points) |
| Stations | Analyse des 7 stations sur 8 critères + tableau distance/temps |
| Voiture | Âges, suppléments, cautions, cartes acceptées, obligations légales |
| Dépenses | Répartition automatique « qui doit combien à qui » |
| Dispos | Contribution financière et contraintes de chacun |
| Discussion | Fil de discussion du groupe |
| Check-list | 35 items en 4 catégories |
| Contacts | 13 numéros vérifiés + urgences |
| Mémoire | Export JSON, impression PDF, activation du partage |

## Le groupe

5 personnes de 19 à 22 ans. Le **Membre 5 a 22 ans avec un permis français depuis
5 ans** : c'est le conducteur principal. Avec un conducteur de 22 ans, tous les
loueurs deviennent accessibles (fin de la contrainte de catégorie « Mini » imposée
aux 19 ans), mais le **supplément jeune conducteur** (moins de 25 ans) reste dû —
facturé **par jour et par conducteur**.

## Station recommandée : Livigno

115 km de pistes, 74 pistes, 32 remontées, village à 1 816 m. Les dates du
13–17 décembre tombent en **période promotionnelle** sur le forfait : 4 jours au
tarif Youth = **163,50 €**.

## Utilisation

### Mode local (par défaut)

Ouvre `index.html`. Tout fonctionne, mais les données restent sur l'appareil.

### Mode partagé (recommandé)

1. Crée un projet gratuit sur [console.firebase.google.com](https://console.firebase.google.com)
2. Active **Realtime Database**, région européenne
3. Dans **Règles**, publie :
   ```json
   {"rules":{".read":true,".write":true}}
   ```
4. Copie l'URL de la base
5. Colle-la dans `app.js`, ligne du haut :
   ```js
   dbUrl: "https://xxx-default-rtdb.europe-west1.firebasedatabase.app",
   ```
6. Republie

Le badge en haut de page indique toujours le mode actif (☁️ Partagé / 💾 Local).

> Les règles ci-dessus rendent la base lisible par quiconque connaît l'URL.
> Le nom de la « room » (`ski-italie-dec2026`) fait office de clé. Adapté à un
> projet de vacances ; à durcir si besoin.

### Publication

- **Netlify Drop** — glisser le dossier sur [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages** — Settings → Pages → branche `main`
- **Vercel** — importer le dépôt

L'app s'installe ensuite sur téléphone (icône écran d'accueil, plein écran).

## Fichiers

```
index.html   structure et contenu
style.css    mise en forme
app.js       données (stations, tâches, contacts, liens) + logique
```

Tout le contenu éditable est dans `app.js` : les constantes `GROUP`, `STATIONS`,
`TASK_SEED`, `CHECKLIST`, `CONTACTS` et `PRESTATIONS`.

## Réserves

Les prix, dates d'ouverture et conditions de location ont été relevés en
novembre 2026 et **évoluent**. Les liens pointent vers les sites officiels : c'est
là qu'il faut vérifier le montant réel au moment de réserver. Le nombre de pistes
réellement ouvertes à la mi-décembre n'est confirmable qu'en appelant la station
3 à 5 jours avant le départ.
