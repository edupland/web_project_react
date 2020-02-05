# QuoteMaps

**QuoteMaps** est une application-jeu dont le principe est le suivant : une citation s'affiche à l'écran, et le joueur doit deviner qui est l'auteur de cette citation parmi les quatre noms proposés par le jeu. Si le joueur trouve la bonne réponse, son score augmente. De plus, si l'utilisateur a du mal à trouver une réponse, il peut alors demander plusieurs indices dont une carte qui s'affiche et indique le lieu de naissance de l'auteur de la citation.
L'utilisateur peut jouer en étant authentifié ou non. <br/>
Nous utilisons les APIs suivantes : 
* [QuoteGarden](https://pprathameshmore.github.io/QuoteGarden/) pour récupérer les citations
* [Wikidata](https://www.wikidata.org/w/api.php) pour récupérer le lieu de naissance de l'auteur de la citation
* [Google Map React](https://github.com/google-map-react/google-map-react) pour afficher la carte du lieu de naissance de l'auteur de la citation

## Membres du projet

- Alexandre BOUYSSOU
- Erwan DUPLAND
- Timothy MARTIN-VIGIER
- Nicolas SENTOUT

## Heroku

Vous pouvez accéder à notre projet en ligne à partir d'[ici](https://quotemaps-client.herokuapp.com/). <br/>
Notre API est disponible [ici](https://quotemaps-api.herokuapp.com/). 

## Installer et lancer le projet

### Dépendances

Vous devez avoir `npm` d'installé.

### Sous Linux

Depuis la racine, tapez les commandes suivantes :

```
./install.sh
./start.sh
```

### Sous Windows

Lancer `install.bat` puis `start.bat`.
