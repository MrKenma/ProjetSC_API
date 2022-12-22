DROP TABLE IF EXISTS organisation CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS town CASCADE;
DROP TABLE IF EXISTS partier CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS shuttle CASCADE;
DROP TABLE IF EXISTS shuttle_member CASCADE;
DROP TABLE IF EXISTS shuttleMember CASCADE;

-- Partie création des tables
-- organization
CREATE TABLE organization (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar NOT NULL,
    password varchar NOT NULL,
    name varchar UNIQUE NOT NULL,
    responsibleName varchar NOT NULL,
    referencePhoneNumber varchar NOT NULL,
    isVerified boolean NOT NULL DEFAULT false
);

-- Town
CREATE TABLE town (
    name varchar NOT NULL,
    zipCode integer NOT NULL,
    PRIMARY KEY(name, zipCode)
);

-- Partier
CREATE TABLE partier (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar UNIQUE NOT NULL,
    pseudo varchar NOT NULL,
    password varchar NOT NULL,
    firstName varchar NOT NULL,
    lastName varchar NOT NULL,
    hasUploadedProfilePicture boolean NOT NULL DEFAULT false,
    phoneNumber varchar NOT NULL,
    refPhoneNumber varchar,
    addressTown varchar,
    addressZipCode integer,
    FOREIGN KEY (addressTown, addressZipCode) REFERENCES town(name, zipCode)
);

-- Event
CREATE TABLE event (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar NOT NULL,
    description varchar NOT NULL,
    nameAndNumStreet varchar NOT NULL,
    departingPoint varchar NOT NULL,
    startDateTime timestamp NOT NULL,
    endDateTime timestamp NOT NULL,
    organizationId integer REFERENCES organization(id) NOT NULL,
    addressTown varchar,
    addressZipCode integer,
    FOREIGN KEY (addressTown, addressZipCode) REFERENCES town(name, zipCode)
);

-- Shuttle
CREATE TABLE shuttle (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    departureTime timestamp NOT NULL,
    eventId integer REFERENCES event(id) NOT NULL,
    destinationTown varchar,
    destinationZipCode integer,
    FOREIGN KEY (destinationTown, destinationZipCode) REFERENCES town(name, zipCode),
    UNIQUE (departureTime, eventId, destinationTown, destinationZipCode)
);

-- Shuttle member
CREATE TABLE shuttleMember (
    hasValidated boolean NOT NULL,
    hasArrivedSafely boolean NOT NULL DEFAULT false,
    shuttleId integer REFERENCES shuttle(id) DEFERRABLE INITIALLY IMMEDIATE,
    partierId integer REFERENCES partier(id) DEFERRABLE INITIALLY IMMEDIATE,
    PRIMARY KEY (shuttleId, partierId)
);

-- Partie remplissage de la base de données
-- organization
INSERT INTO organization (email, password, name, responsibleName, referencePhoneNumber, isVerified) VALUES
('cercleIESN@gmail.com', 'password', 'Cercle IESN', 'Jean Dupont', '0498867457', false),
('cercleEco@gmail.com', 'password', 'Cercle Eco', 'Guillaume Turpin', '0478965467', false),
('cercleChigé@gmail.com', 'password', 'Cercle Chigé', 'La panthère rose', '086754654', false);

-- Town
INSERT INTO town ("name", zipCode) VALUES
('Namur', 5000),
('Beez', 5000),
('Belgrade', 5001),
('Saint-Servais', 5002),
('Saint-Marc', 5003),
('Bouge', 5004),
('Malonne', 5020),
('Daussoulx', 5020),
('Suarlée', 5020),
('Vedrin', 5020),
('Temploux', 5020),
('Rhisnes', 5020),
('Flawinne', 5020),
('Champion', 5020),
('Bonnine', 5021),
('Cognelée', 5022),
('Marche-les-Dames', 5024),
('Gelbressée', 5024),
('Wierde', 5100),
('Dave', 5100),
('Wépion', 5100),
('Naninne', 5100),
('Jambes', 5100),
('Erpent', 5101),
('Lives-sur-Meuse', 5101),
('Loyers', 5101);

-- Partier
INSERT INTO partier (email, pseudo, password, firstName, lastName, hasUploadedProfilePicture, phoneNumber, refPhoneNumber, addressTown, addressZipCode) VALUES
('etu44721@henallux.be', 'Wan', 'password', 'Wangi', 'Weber', false, '0499517092', '0499265087', 'Saint-Servais', 5002),
('etu44108@henallux.be', 'Sim', 'password', 'Simon', 'Rollus', false, '0499172696', '0499585449', 'Malonne', 5020),
('etu47233@henallux.be', 'MrKenma', 'password', 'Julien', 'Hanquet', false, '0499579465', '0499164954', 'Wierde', 5100),
('fhmqez@gmail.com', 'Pseudo', 'password', 'Prénom', 'Nom', false, '0499270747', null, 'Loyers', 5101);

-- Event
INSERT INTO event (name, description, nameAndNumStreet, departingPoint, startDateTime, endDateTime, organizationId, addressTown, addressZipCode) VALUES
('Bunker med', 'Soirée plutôt sympa en vrai', 'rue de Bruxelles, 31', 'En fasse de l entrée', current_timestamp, current_timestamp, 2, 'Malonne', 5020),
('Bunker info', 'Soirée plutôt sympa en vrai', 'rue de Bruxelles, 31', 'En fasse de l entrée', current_timestamp, current_timestamp, 2, 'Malonne', 5020),
('Bunker eco', 'Soirée plutôt sympa en vrai', 'rue de Bruxelles, 31', 'En fasse de l entrée', current_timestamp, current_timestamp, 2, 'Malonne', 5020),
('Bal des bleus', 'Soirée également plutôt sympa', 'rue Joseph Calozet, 19', 'sortie du parking', current_timestamp, current_timestamp, 1, 'Saint-Servais', 5002),
('Forfaire info', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', current_timestamp, current_timestamp, 3, 'Beez', 5000),
('Forfaire eco', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', current_timestamp, current_timestamp, 3, 'Bonnine', 5021),
('Soirée de rentrée', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', current_timestamp, current_timestamp, 3, 'Loyers', 5101),
('La St-nic', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', current_timestamp, current_timestamp, 3, 'Erpent', 5101),
('Soirée éco gestion', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', current_timestamp, current_timestamp, 3, 'Jambes', 5100);

-- Shuttle
INSERT INTO shuttle (departureTime, eventId, destinationTown, destinationZipCode) VALUES
(current_timestamp, 1, 'Wierde', 5100),
(current_timestamp, 1, 'Bonnine', 5021),
(current_timestamp, 1, 'Cognelée', 5022),
(current_timestamp, 2, 'Wierde', 5100),
(current_timestamp, 2, 'Saint-Marc', 5003),
(current_timestamp, 3, 'Bouge', 5004);

-- Shuttle member
INSERT INTO shuttleMember (hasValidated, hasArrivedSafely, shuttleId, partierId) VALUES
(true, false, 1, 1),
(false, false,  2, 1),
(false, false, 4, 2);
