# map-osm-dashboard

## Run project

Vous pouvez lancer le projet via Docker pour éviter de devoir installer les dépendances sur votre machine.

Build de l'image Docker :  
`docker build -t map-osm-dashboard .`

Run le docker :  
`docker run -p 8080:80 map-osm-dashboard`

Le projet est accessible sur :  
`localhost:8080`

## Architecture projet

Le projet est composé d'une vue principale : HomeView.
Cette vue instancie trois composants : MapOSM, Filters, Stats.

### MapOSM

MapOSM affiche la carte interactive et gère l'ajout des différents marqueurs sur la carte.
Il y a trois layers pour chaque types de marqueurs : espaces verts, arbres et ilots de chaleur.  
L'affichage des marqueurs arbres se fait au zoom sur la map pour réduire le nombre de marqueurs à charger et afficher simultanément.  
Pour l'affichage des ilots de chaleur, une première version se limite au 1000 premières données du fichier csv.

### Filters

Filters permet à l'utilisateur de sélectionner les types d'espaces verts qu'il souhaite afficher sur la carte.

### Stats

Avec ce composant, on propose deux graphiques qui présentent des statistiques liées aux données espaces verts et arbres.

## Dépendances utilisées

### Carte OSM

- Leaflet : ^1.9.4

### Graphiques

- vue-charjs : ^5.3.2
- Chart.js : ^4.4.6

### CSV

- Papa Parse : ^5.4.1
