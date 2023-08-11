CREATION DU CONTAINER DOCKER:
docker run --name postgresSmartCity -e POSTGRES_PASSWORD=password -e POSTGRES_USER=julien -e POSTGRES_DB=projetSC -p 5431:5432 -d postgres

INITIALISATION ET CONNEXION BD:
>init createDB
>init genDoc

INSTALLATION DU PROGRAMME:
>cd API
>npm install
>npm install dotenv
>npm run dev

TESTS POSTMAN:
ProjetSC_API\Postman\SmartCity - Besafe.postman_collection.json

DOCUMENTATION SWAGGER:
ProjetSC_API\API\swagger\specs.json
