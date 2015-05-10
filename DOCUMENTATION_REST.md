Services REST offerts
===

### 1 - Consultation d'un dossier de patient

&emsp;Description : Envoie au client le dossier complet du patient, en format JSON.
<br>&emsp;Méthode : **GET**
<br>&emsp;URL : **_/dossiers/:id_** (où id est l'identifiant du patient composé de 24 caractères hexadécimaux)

&emsp;**200** : Succès.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			date_naissance : ISODate,
			groupe_sanguin : string,
			poids_kg : number,
			taille_cm : number,
			don_organes : boolean,
			visites : [
				{
					date : ISODate,
					nom_professionnel : string,
					specialite : string
				}
			]
		}

&emsp;**400** : Le paramètre id doit être composé de 24 caractères hexadicémaux.

&emsp;**404** : Dossier de patient inexistant.

<br>
### 2 - Ajout d'un dossier de patient

&emsp;Description : Reçoit du client un dossier complet de patient, en format JSON, et crée le dossier.
<br>&emsp;Méthode : **POST**
<br>&emsp;URL : **_/dossiers_**

&emsp;Le format à fournir pour l'ajout d'un dossier patient est le suivant :

		{
			sexe : number,
			nom : string,
			prenom : string,
			date_naissance : ISODate,
			groupe_sanguin : string,
			poids_kg : number,
			taille_cm : number,
			don_organes : boolean,
			visites : empty array
		}

&emsp;**Précisions**
+ Le champ "visites" doit être un tableau vide, un nouveau patient n'a pas encore de visite.
+ Le format attendu pour le sexe est le format ISO 5128, nombre entier entre 0 et 2 inclusivement.
+ Le format attendu pour la date est le format ISO 8601 (YYYY-MM-DD).

<br>
&emsp;**201** : Le dossier de patient a été ajouté.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			date_naissance : ISODate,
			groupe_sanguin : string,
			poids_kg : number,
			taille_cm : number,
			don_organes : boolean,
			visites : empty array
		}

&emsp;**400** : Les données entrées ne respectent pas le format attendu.

<br>
### 3 - Modification d'un dossier de patient

&emsp;Description : Reçoit du client l'ensemble des modifications à apporter au dossier, en format JSON,
<br>&emsp;et les applique au dossier.
<br>&emsp;Méthode : **PUT**
<br>&emsp;URL : **_/dossiers/:id_** (où id est l'identifiant du patient composé de 24 caractères hexadécimaux)

&emsp;Le format d'un dossier patient est le suivant :

		{
			sexe : number,
			nom : string,
			prenom : string,
			date_naissance : ISODate,
			groupe_sanguin : string,
			poids_kg : number,
			taille_cm : number,
			don_organes : boolean,
			visites : [
				{
					date : ISODate,
					nom_professionnel : string,
					specialite : string
				}
			]
		}

&emsp;**Précisions**
+ Lors d'une modification, le champ "visites" est écrasé par les nouvelles valeurs qui seront fournies. Visites peut être un tableau vide.
+ Le format attendu pour le sexe est le format ISO 5128, nombre entier entre 0 et 2 inclusivement.
+ Le format attendu pour la date est le format ISO 8601 (YYYY-MM-DD).

&emsp;**N.B. Le client envoi seulement le(s) champ(s) qu'il désire modifier.**

<br>
&emsp;**200** : Succès.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			date_naissance : ISODate,
			groupe_sanguin : string,
			poids_kg : number,
			taille_cm : number,
			don_organes : boolean,
			visites : [
				{
					date : ISODate,
					nom_professionnel : string,
					specialite : string
				}
			]
		}

&emsp;**400** : Les données entrées ne respectent pas le format attendu.

&emsp;**404** : Dossier de patient inexistant.

<br>
### 4 - Suppression d'un dossier de patient

&emsp;Description : Supprime le dossier du patient.
<br>&emsp;Méthode : **DELETE**
<br>&emsp;URL : **_/dossiers/:id_** (où id est l'identifiant du patient composé de 24 caractères hexadécimaux)

&emsp;**200** : Succès.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			date_naissance : ISODate,
			groupe_sanguin : string,
			poids_kg : number,
			taille_cm : number,
			don_organes : boolean,
			visites : [
				{
					date : ISODate,
					nom_professionnel : string,
					specialite : string
				}
			]
		}

&emsp;**403** : Il est impossible de supprimer un dossier si le patient a visité un professionnel dans les 5 dernières années.

&emsp;**404** : Dossier de patient inexistant.

<br>
### 5 - Consultation d'un professionnel

&emsp;Description : Envoie au client les données d'un professionnel, en format JSON.
<br>&emsp;Méthode : **GET**
<br>&emsp;URL : **_/pros/:id_** (où id est l'identifiant du professionnel composé de 24 caractères hexadécimaux)

&emsp;**200** : Succès.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			specialite : string,
			rencontres_2014 : [
				{
					nom : string,
					prenom : string,
					id : string
				}
			],
			nombre_patients : number,
			total_visites : number
		}

&emsp;**400** : Le paramètre id doit être composé de 24 caractères hexadicémaux.

&emsp;**404** : Professionnel inexistant.

<br>
### 6 - Ajout d'un professionnel
&emsp;Description : Reçoit du client les données complètes d'un professionnel, en format JSON, et le crée.
<br>&emsp;Méthode : **POST**
<br>&emsp;URL : **_/pros_**

&emsp;Le format à fournir pour l'ajout d'un professionnel est le suivant :

		{
			sexe : number,
			nom : string,
			prenom : string,
			specialite : string,
			rencontres_2014 : empty array,
			nombre_patients : number,
			total_visites : number
		}

&emsp;**Précisions**
+ Les champs "nombre_patients" et "total_visites" peuvent seulement avoir la valeur 0.
+ Le champ "rencontres_2014" doit être un tableau vide, un nouveau professionnel n'a pas encore vu de patient.
+ Le format attendu pour le sexe est le format ISO 5128, nombre entier entre 0 et 2 inclusivement.
+ Le format attendu pour la date est le format ISO 8601 (YYYY-MM-DD).

<br>
&emsp;**201** : Le professionnel a été ajouté.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			specialite : string,
			rencontres_2014 : [
				{
					nom : string,
					prenom : string,
					id : string
				}
			],
			nombre_patients : number,
			total_visites : number
		}

&emsp;**400** : Les données entrées ne respectent pas le format attendu.

<br>
### 7 - Modification d'un professionnel

&emsp;Description : Reçoit du client l'ensemble des modifications à apporter au professionnel, en format
<br>&emsp;JSON, et les applique au professionnel.
<br>&emsp;Méthode : **PUT**
<br>&emsp;URL : **_/pros/:id_** (où id est l'identifiant du professionnel composé de 24 caractères hexadécimaux)

&emsp;Le format des données pour un professionnel est le suivant :

		{
			sexe : number,
			nom : string,
			prenom : string,
			specialite : string,
			rencontres_2014 : [
				{
					nom : string,
					prenom : string,
					id : string
				}
			],
			nombre_patients : number,
			total_visites : number
		}

&emsp;**Précisions**
+ Lors d'une modification, le champ "rencontres_2014" est écrasé par les nouvelles valeurs qui seront fournies. Le champ peut être un tableau vide.
+ Le format attendu pour le sexe est le format ISO 5128, nombre entier entre 0 et 2 inclusivement.
+ Le format attendu pour la date est le format ISO 8601 (YYYY-MM-DD).

&emsp;**N.B. Le client envoi seulement le(s) champ(s) qu'il désire modifier.**

<br>
&emsp;**200** : Succès.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			specialite : string,
			rencontres_2014 : [
				{
					nom : string,
					prenom : string,
					id : string
				}
			],
			nombre_patients : number,
			total_visites : number
		}

&emsp;**400** : Les données entrées ne respectent pas le format attendu.

&emsp;**404** : Professionnel inexistant.

<br>
### 8 - Suppression d'un professionnel
&emsp;Description : Supprime le professionnel.
<br>&emsp;Méthode : **DELETE**
<br>&emsp;URL : **_/pros/:id_** (où id est l'identifiant du professionnel composé de 24 caractères hexadécimaux)

&emsp;**200** : Succès.

		{
			_id : ObjectId,
			sexe : number,
			nom : string,
			prenom : string,
			specialite : string,
			rencontres_2014 : [
				{
					nom : string,
					prenom : string,
					id : string
				}
			],
			nombre_patients : number,
			total_visites : number
		}

&emsp;**403** : Il est impossible de supprimer un professionnel s'il a eu des visites en 2014.

&emsp;**404** : Professionnel inexistant.
