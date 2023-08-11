SET timezone = 'Europe/Paris';

DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS organization CASCADE;
DROP TABLE IF EXISTS town CASCADE;
DROP TABLE IF EXISTS partier CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS shuttle CASCADE;
DROP TABLE IF EXISTS shuttleMember CASCADE; 

-- Partie création des tables
-- user
CREATE TABLE "user" (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    pseudo varchar(32) NOT NULL UNIQUE,
    phoneNumber varchar(16) NOT NULL,
    hasUploadedProfilePicture boolean NOT NULL DEFAULT false,
    isAdmin boolean NOT NULL DEFAULT false
);

-- organization
CREATE TABLE organization (
    userID integer PRIMARY KEY,
    responsibleName varchar(32) NOT NULL,
    isVerified boolean NOT NULL DEFAULT false,
    FOREIGN KEY(userID) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Town
CREATE TABLE town (
    name varchar NOT NULL,
    zipCode integer NOT NULL,
    PRIMARY KEY(name, zipCode)
);

-- Partier
CREATE TABLE partier (
    userID integer PRIMARY KEY ,
    firstName varchar(16) NOT NULL,
    lastName varchar(16) NOT NULL,
    refPhoneNumber varchar(16),
    addressTown varchar NOT NULL,
    addressZipCode integer NOT NULL,
    FOREIGN KEY (userID) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (addressTown, addressZipCode) REFERENCES town(name, zipCode)
);

-- Event
CREATE TABLE event (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(32) NOT NULL UNIQUE,
    description varchar(256) NOT NULL,
    nameAndNumStreet varchar(64) NOT NULL,
    departingPoint varchar(64) NOT NULL,
    startDateTime timestamp NOT NULL,
    endDateTime timestamp NOT NULL,
    organizationID integer REFERENCES organization(userID) NOT NULL,
    addressTown varchar NOT NULL,
    addressZipCode integer NOT NULL,
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
    hasValidated boolean NOT NULL DEFAULT false,
    hasArrivedSafely boolean NOT NULL DEFAULT false,
    shuttleId integer REFERENCES shuttle(id) DEFERRABLE INITIALLY IMMEDIATE,
    partierId integer REFERENCES partier(userID) DEFERRABLE INITIALLY IMMEDIATE,
    PRIMARY KEY (shuttleId, partierId)
);

-- Partie remplissage de la base de données
-- user
INSERT INTO "user"(email, password, pseudo, phoneNumber, hasUploadedProfilePicture, isAdmin) VALUES
('fhmqez@gmail.com', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'Pseudo', '0499270747', false, true),
('admin@gmail.com', '$2a$10$l4Eecn3x1IstKmQC12a/S.RqeABVnsygeDogmBkAvOKjmB/7GUjXG', 'Admin', '0498262596', false, true),
('cercleIESN@gmail.com', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'Cercle IESN', '0498867457', false, false),
('cercleEco@gmail.com', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'Cercle Eco', '0478965467', false, false),
('cercleChigé@gmail.com', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'Cercle Chigé', '086754654', false, false),
('etu44721@henallux.be', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'Wan', '0499517092', false, false),
('etu44108@henallux.be', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'Sim', '0499172696', false, false),
('etu47233@henallux.be', '$2b$10$UYrmYvD/jGF2PiJDEVGAKeMFP.72B0IpSxt3LHxcdSAB0l8OBNsLe', 'MrKenma', '0499579465', false, false),
('partier@gmail.com', '$2a$10$l4Eecn3x1IstKmQC12a/S.RqeABVnsygeDogmBkAvOKjmB/7GUjXG', 'Partier', '0498262596', false, false),
('organization@gmail.com', '$2a$10$l4Eecn3x1IstKmQC12a/S.RqeABVnsygeDogmBkAvOKjmB/7GUjXG', 'Organization', '0498262586', false, false);

-- organization
INSERT INTO organization (userID, responsibleName, isVerified) VALUES
(3, 'Jean Dupont', false),
(4, 'Guillaume Turpin', false),
(5, 'La panthère rose', true),
(10, 'Mr.Organization', false);

-- Town
INSERT INTO town (name, zipCode) VALUES
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
INSERT INTO partier (userID, firstName, lastName, refPhoneNumber, addressTown, addressZipCode) VALUES
(6, 'Wangi', 'Weber', '0499265087', 'Saint-Servais', 5002),
(7, 'Simon', 'Rollus', '0499585449', 'Malonne', 5020),
(8, 'Julien', 'Hanquet', '0499164954', 'Wierde', 5100),
(9, 'Partier', 'Partier', '0498629782', 'Loyers', 5101);

-- Event
INSERT INTO event (name, description, nameAndNumStreet, departingPoint, startDateTime, endDateTime, organizationId, addressTown, addressZipCode) VALUES
('Bunker med', 'Soirée plutôt sympa en vrai', 'rue de Bruxelles, 31', 'En fasse de l entrée', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 4, 'Malonne', 5020),
('Bunker test', 'Soirée plutôt sympa en vrai', 'rue de Bruxelles, 31', 'En fasse de l entrée', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 4, 'Malonne', 5020),
('Bunker eco', 'Soirée plutôt sympa en vrai', 'rue de Bruxelles, 31', 'En fasse de l entrée', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 4, 'Malonne', 5020),
('Bal des bleus', 'Soirée également plutôt sympa', 'rue Joseph Calozet, 19', 'sortie du parking', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 3, 'Saint-Servais', 5002),
('Forfaire info', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 5, 'Beez', 5000),
('Forfaire eco', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 5, 'Bonnine', 5021),
('Soirée de rentrée', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 5, 'Loyers', 5101),
('La St-nic', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 5, 'Erpent', 5101),
('Soirée éco gestion', 'Soirée un peu nulle en vrai', 'rue Godefroid, 20', 'devant la gare', '2023-07-31 20:00:00', '2023-08-01 02:00:00', 5, 'Jambes', 5100);

