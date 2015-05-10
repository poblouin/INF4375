## Travail pratique 3
### INF4375 - Paradigmes des échanges Internet


Pierre-Olivier Blouin <br>
BLOP11068701 <br>
blouin.pierre-olivier.2@courrier.uqam.ca

##### Commandes pour construire la base de données et démarer le serveur

+ Premièrement, faire un **_npm install_** à la racine du projet seulement.
+ Pour construire la base de données ET démarrer le serveur : **_npm run-script migration_start_**
+ Pour construire la base de données : **_npm run-script migration_**
+ Pour démarrer le serveur : **_npm start_**

##### Documentation

+ La documentation REST est disponible sur la route **_/doc_**


##### Routes TP3

+ La page d'accueil est sur la route **_/_**
+ La consultation d'un professionnel sur la route **_/pros/consulter/:id_**
+ La modification d'un professionnel sur la route **_/pros/modifier/:id_**
+ La création d'un professionnel sur la route **_/pros/ajouter_**
