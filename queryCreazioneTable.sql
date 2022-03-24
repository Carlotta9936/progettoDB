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

#Sponsor
CREATE TABLE `confvirtual`.`sponsor` (
  `nome` VARCHAR(50) NOT NULL,
  `logo` VARCHAR(30) NULL,
  PRIMARY KEY (`nome`));
  
 #Conferenza
 CREATE TABLE `confvirtual`.`conferenza` (
  `acronimo` VARCHAR(10) NOT NULL,
  `anno` YEAR(4) NOT NULL,
  `logo` VARCHAR(30) NULL,
  `svolgimento` ENUM('attiva', 'completata') NOT NULL,
  `datainizio` DATE NOT NULL,
  `datafine` DATE NOT NULL,
  `totale_sponsorizzazioni` INT NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `creatore` VARCHAR(45) NOT NULL,
  INDEX `anno_idx` (`anno` ASC) VISIBLE,
  PRIMARY KEY (`acronimo`, `anno`));
  
 #Sponsorizzazione
 CREATE TABLE `confvirtual`.`sponsorizzazione` (
  `importo` FLOAT(8,2) NOT NULL,
  `annoConf` YEAR(4) NOT NULL,
  `acronimoConf` VARCHAR(10) NOT NULL,
  `nome_sponsor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`annoConf`, `acronimoConf`, `nome_sponsor`),
  INDEX `nome_idx` (`nome_sponsor` ASC) VISIBLE,
  INDEX `acronimo_idx` (`acronimoConf` ASC) VISIBLE,
  CONSTRAINT `nome`
    FOREIGN KEY (`nome_sponsor`)
    REFERENCES `confvirtual`.`sponsor` (`nome`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `anno`
    FOREIGN KEY (`annoConf`)
    REFERENCES `confvirtual`.`conferenza` (`anno`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `acronimo`
    FOREIGN KEY (`acronimoConf`)
    REFERENCES `confvirtual`.`conferenza` (`acronimo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Programma Giornaliero
 CREATE TABLE `confvirtual`.`programma_giornaliero` (
  `id_programma` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `anno` YEAR(4) NOT NULL,
  `acronimo` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id_programma`),
  INDEX `anno_idx` (`anno` ASC) INVISIBLE,
  INDEX `acronimo_idx` (`acronimo` ASC) INVISIBLE,
  CONSTRAINT `anno1`
    FOREIGN KEY (`anno`)
    REFERENCES `confvirtual`.`conferenza` (`anno`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `acronimo1`
    FOREIGN KEY (`acronimo`)
    REFERENCES `confvirtual`.`conferenza` (`acronimo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Sessione
 CREATE TABLE `confvirtual`.`sessione` (
  `id_sessione` INT NOT NULL AUTO_INCREMENT,
  `ora_f` TIME NOT NULL,
  `ora_i` TIME NOT NULL,
  `titolo` VARCHAR(100) NOT NULL,
  `link` VARCHAR(50) NOT NULL,
  `num_presentazioni` INT NOT NULL,
  `programma` INT NOT NULL,
  PRIMARY KEY (`id_sessione`),
  INDEX `progrmma1_idx` (`programma` ASC) VISIBLE,
  CONSTRAINT `progrmma1`
    FOREIGN KEY (`programma`)
    REFERENCES `confvirtual`.`programma_giornaliero` (`id_programma`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Presentazione
CREATE TABLE `confvirtual`.`presentazione` (
  `id_presentazione` INT NOT NULL AUTO_INCREMENT,
  `ora_f` TIME NOT NULL,
  `ora_i` TIME NOT NULL,
  `ordine` INT NOT NULL,
  `sessione` INT NOT NULL,
  PRIMARY KEY (`id_presentazione`),
  INDEX `sessione1_idx` (`sessione` ASC) VISIBLE,
  CONSTRAINT `sessione1`
    FOREIGN KEY (`sessione`)
    REFERENCES `confvirtual`.`sessione` (`id_sessione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Articolo
CREATE TABLE `confvirtual`.`articolo` (
  `id_articolo` INT NOT NULL,
  `pdf` VARCHAR(70) NOT NULL,
  `stato` ENUM('coperto', 'non coperto') NOT NULL,
  `n_pagine` INT NULL,
  `usernamePresenter` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_articolo`),
  CONSTRAINT `presenter1`
    FOREIGN KEY (`usernamePresenter`)
    REFERENCES `confvirtual`.`presenter` (`usernamePresenter`),
  CONSTRAINT `articolo1`
    FOREIGN KEY (`id_articolo`)
    REFERENCES `confvirtual`.`presentazione` (`id_presentazione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Chiave
 CREATE TABLE `confvirtual`.`chiave` (
  `parola` VARCHAR(15) NOT NULL,
  `articolo` INT NOT NULL,
  PRIMARY KEY (`parola`, `articolo`),
  INDEX `articolo2_idx` (`articolo` ASC) VISIBLE,
  CONSTRAINT `articolo2`
    FOREIGN KEY (`articolo`)
    REFERENCES `confvirtual`.`articolo` (`id_articolo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Autore
 CREATE TABLE `confvirtual`.`autore` (
  `id_autore` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cognome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_autore`));

#Scritto
CREATE TABLE `confvirtual`.`scritto` (
  `autore` INT NOT NULL,
  `articolo` INT NOT NULL,
  PRIMARY KEY (`autore`, `articolo`),
  INDEX `articolo3_idx` (`articolo` ASC) VISIBLE,
  CONSTRAINT `articolo3`
    FOREIGN KEY (`articolo`)
    REFERENCES `confvirtual`.`articolo` (`id_articolo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `autore1`
    FOREIGN KEY (`autore`)
    REFERENCES `confvirtual`.`autore` (`id_autore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Tutorial
 CREATE TABLE `confvirtual`.`tutorial` (
  `id_tutorial` INT NOT NULL AUTO_INCREMENT,
  `titolo` VARCHAR(70) NOT NULL,
  `abstract` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id_tutorial`),
  CONSTRAINT `tutorial1`
    FOREIGN KEY (`id_tutorial`)
    REFERENCES `confvirtual`.`presentazione` (`id_presentazione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Risorsa aggiuntiva
 CREATE TABLE `confvirtual`.`risorsa_aggiuntiva` (
  `id_risorsa` INT NOT NULL AUTO_INCREMENT,
  `link` VARCHAR(50) NOT NULL,
  `descrizione` VARCHAR(100) NULL,
  `usernameSpeaker` VARCHAR(45) NOT NULL,
  `tutorial` INT NOT NULL,
  PRIMARY KEY (`id_risorsa`),
  CONSTRAINT `speaker1`
    FOREIGN KEY (`usernameSpeaker`)
    REFERENCES `confvirtual`.`speaker` (`usernameSpeaker`),
  INDEX `tutorial2_idx` (`tutorial` ASC) VISIBLE,
  CONSTRAINT `tutorial2`
    FOREIGN KEY (`tutorial`)
    REFERENCES `confvirtual`.`tutorial` (`id_tutorial`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
