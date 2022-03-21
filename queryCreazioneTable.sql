use progettodb;
#Creazione delle tabelle
#Conferenza
#Sponsorizzazione
#Sponsor
#Programma_giornaliero
#Sessione
#Presentazione
#Articolo
#Tutorial

#Utente
CREATE TABLE `utente` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `cognome` VARCHAR(45) NOT NULL,
  `luogo_nascita` VARCHAR(45) NOT NULL,
  `data_nascita` DATETIME NOT NULL,
  PRIMARY KEY (`username`));
  
#Speaker
CREATE TABLE `progettodb`.`speaker` (
  `usernameSpeaker` VARCHAR(30) NOT NULL,
  `universita` VARCHAR(45) NOT NULL,
  `dipartimento` VARCHAR(45) NOT NULL,
  `cv` VARCHAR(45) NULL,
  `foto` VARCHAR(45) NULL,
  PRIMARY KEY (`usernameSpeaker`),
  CONSTRAINT `usernameSpeaker`
    FOREIGN KEY (`usernameSpeaker`)
    REFERENCES `progettodb`.`utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Presenter
CREATE TABLE `progettodb`.`presenter` (
  `usernamePresenter` VARCHAR(30) NOT NULL,
  `universita` VARCHAR(45) NOT NULL,
  `dipartimento` VARCHAR(45) NOT NULL,
  `cv` VARCHAR(45) NULL,
  `foto` VARCHAR(45) NULL,
  PRIMARY KEY (`usernamePresenter`),
  CONSTRAINT `usernamePresenter`
    FOREIGN KEY (`usernamePresenter`)
    REFERENCES `progettodb`.`utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
#Amministratore
CREATE TABLE `progettodb`.`amministratore` (
  `usernameAdmin` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`usernameAdmin`),
  CONSTRAINT `usernameAdmin`
    FOREIGN KEY (`usernameAdmin`)
    REFERENCES `progettodb`.`utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Presenta
#Valutazione
#Associazione
#Iscrizione
#Preferiti