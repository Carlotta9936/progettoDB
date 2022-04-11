use confvirtual;
#Creazione delle tabelle
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
CREATE TABLE `speaker` (
  `usernameSpeaker` VARCHAR(30) NOT NULL,
  `universita` VARCHAR(45) NOT NULL,
  `dipartimento` VARCHAR(45) NOT NULL,
  `cv` VARCHAR(45) NULL,
  `foto` VARCHAR(45) NULL,
  PRIMARY KEY (`usernameSpeaker`),
  CONSTRAINT `usernameSpeaker`
    FOREIGN KEY (`usernameSpeaker`)
    REFERENCES `utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Presenter
CREATE TABLE `presenter` (
  `usernamePresenter` VARCHAR(30) NOT NULL,
  `universita` VARCHAR(45) NOT NULL,
  `dipartimento` VARCHAR(45) NOT NULL,
  `cv` VARCHAR(45) NULL,
  `foto` VARCHAR(45) NULL,
  PRIMARY KEY (`usernamePresenter`),
  CONSTRAINT `usernamePresenter`
    FOREIGN KEY (`usernamePresenter`)
    REFERENCES `utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
#Amministratore
CREATE TABLE `amministratore` (
  `usernameAdmin` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`usernameAdmin`),
  CONSTRAINT `usernameAdmin`
    FOREIGN KEY (`usernameAdmin`)
    REFERENCES `utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Presenta
CREATE TABLE `presenta`(
	`presenta_usernameSpeaker` VARCHAR(30) NOT NULL,
    `tutorial` INT NOT NULL,
    PRIMARY KEY (presenta_usernameSpeaker, tutorial),
	CONSTRAINT presenta_usernameSpeaker
		FOREIGN KEY (presenta_usernameSpeaker)
		REFERENCES speaker(usernameSpeaker)
        ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT tutorial
		FOREIGN KEY (tutorial)
		REFERENCES tutorial(id_tutorial)
        ON DELETE CASCADE
		ON UPDATE CASCADE
);

#Valutazione
CREATE TABLE valutazione(
	idValutazione INT NOT NULL AUTO_INCREMENT,
    valutazione_admin VARCHAR(30) NOT NULL,
    valutazione_presentazione INT NOT NULL,
    valutazione INT NOT NULL,
    PRIMARY KEY(idValutazione),
    CONSTRAINT valutazione_admin
		FOREIGN KEY (valutazione_admin)
        REFERENCES amministratore(usernameAdmin)
        ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT valutazione_presentazione
		FOREIGN KEY (valutazione_presentazione)
        REFERENCES presentazione(id_presentazione)
        ON DELETE CASCADE
		ON UPDATE CASCADE
);

#Associazione
CREATE TABLE `associazione` (
  `idAssociazione` INT NOT NULL AUTO_INCREMENT,
  `associazione_anno` YEAR(4) NULL,
  `associazione_acronimo` VARCHAR(45) NULL,
  `associazione_username` VARCHAR(45) NULL,
  PRIMARY KEY (`idAssociazione`),
  CONSTRAINT `associazione_anno`
    FOREIGN KEY (`associazione_anno`)
    REFERENCES `confvirtual`.`conferenza` (`anno`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `associazione_acronimo`
    FOREIGN KEY (`associazione_acronimo`)
    REFERENCES `confvirtual`.`conferenza` (`acronimo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `associazione_username`
    FOREIGN KEY (`associazione_username`)
    REFERENCES `confvirtual`.`amministratore` (`usernameAdmin`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Iscrizione
CREATE TABLE iscrizione (
	idIscrizione INT NOT NULL AUTO_INCREMENT,
    `iscrizione_anno` YEAR(4) NULL,
	`iscrizione_acronimo` VARCHAR(45) NULL,
	`iscrizione_username` VARCHAR(45) NULL,
	PRIMARY KEY (`idIscrizione`),
	CONSTRAINT `iscrizione_anno`
	FOREIGN KEY (`iscrizione_anno`)
	REFERENCES `confvirtual`.`conferenza` (`anno`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	CONSTRAINT `iscrizione_acronimo`
	FOREIGN KEY (`iscrizione_acronimo`)
	REFERENCES `confvirtual`.`conferenza` (`acronimo`)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	CONSTRAINT `iscrizione_username`
	FOREIGN KEY (`iscrizione_username`)
	REFERENCES `confvirtual`.`utente` (`username`)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

#Preferiti
CREATE TABLE preferiti(
	preferiti_username VARCHAR(30) NOT NULL,
    preferiti_presentazione INT NOT NULL,
    PRIMARY KEY (preferiti_username, preferiti_presentazione),
	CONSTRAINT preferiti_username
		FOREIGN KEY (preferiti_username)
		REFERENCES utente(username)
        ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT preferiti_presentazione
		FOREIGN KEY (preferiti_presentazione)
		REFERENCES presentazione(id_presentazione)
        ON DELETE CASCADE
		ON UPDATE CASCADE
);
#Sponsor
CREATE TABLE `sponsor` (
  `nome` VARCHAR(50) NOT NULL,
  `logo` VARCHAR(30) NULL,
  PRIMARY KEY (`nome`));
  
 #Conferenza
 CREATE TABLE `conferenza` (
  `acronimo` VARCHAR(10) NOT NULL,
  `anno` YEAR(4) NOT NULL,
  `logo` VARCHAR(30) NULL,
  `svolgimento` ENUM('attiva', 'completata') NOT NULL,
  `datainizio` DATE NOT NULL,
  `datafine` DATE NOT NULL,
  `totale_sponsorizzazioni` INT NOT NULL DA,
  `nome` VARCHAR(50) NOT NULL,
  `creatore` VARCHAR(45) NOT NULL,
  INDEX `anno_idx` (`anno` ASC) VISIBLE,
  PRIMARY KEY (`acronimo`, `anno`));
  
 #Sponsorizzazione
 CREATE TABLE `sponsorizzazione` (
  `importo` FLOAT(8,2) NOT NULL,
  `annoConf` YEAR(4) NOT NULL,
  `acronimoConf` VARCHAR(10) NOT NULL,
  `nome_sponsor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`annoConf`, `acronimoConf`, `nome_sponsor`),
  INDEX `nome_idx` (`nome_sponsor` ASC) VISIBLE,
  INDEX `acronimo_idx` (`acronimoConf` ASC) VISIBLE,
  CONSTRAINT `nome`
    FOREIGN KEY (`nome_sponsor`)
    REFERENCES `sponsor` (`nome`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `anno`
    FOREIGN KEY (`annoConf`)
    REFERENCES `conferenza` (`anno`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `acronimo`
    FOREIGN KEY (`acronimoConf`)
    REFERENCES `conferenza` (`acronimo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Programma Giornaliero
 CREATE TABLE `programma_giornaliero` (
  `id_programma` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `anno` YEAR(4) NOT NULL,
  `acronimo` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id_programma`),
  INDEX `anno_idx` (`anno` ASC) INVISIBLE,
  INDEX `acronimo_idx` (`acronimo` ASC) INVISIBLE,
  CONSTRAINT `anno1`
    FOREIGN KEY (`anno`)
    REFERENCES `conferenza` (`anno`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `acronimo1`
    FOREIGN KEY (`acronimo`)
    REFERENCES `conferenza` (`acronimo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Sessione
 CREATE TABLE `sessione` (
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
    REFERENCES `programma_giornaliero` (`id_programma`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Presentazione
CREATE TABLE `presentazione` (
  `id_presentazione` INT NOT NULL AUTO_INCREMENT,
  `ora_f` TIME NOT NULL,
  `ora_i` TIME NOT NULL,
  `ordine` INT NOT NULL,
  `sessione` INT NOT NULL,
  PRIMARY KEY (`id_presentazione`),
  INDEX `sessione1_idx` (`sessione` ASC) VISIBLE,
  CONSTRAINT `sessione1`
    FOREIGN KEY (`sessione`)
    REFERENCES `sessione` (`id_sessione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Articolo
CREATE TABLE `articolo` (
  `id_articolo` INT NOT NULL,
  `pdf` VARCHAR(70) NOT NULL,
  `stato` ENUM('coperto', 'non coperto') NOT NULL,
  `n_pagine` INT NULL,
  `usernamePresenter` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_articolo`),
  CONSTRAINT `presenter1`
    FOREIGN KEY (`usernamePresenter`)
    REFERENCES `presenter` (`usernamePresenter`),
  CONSTRAINT `articolo1`
    FOREIGN KEY (`id_articolo`)
    REFERENCES `presentazione` (`id_presentazione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Chiave
 CREATE TABLE `chiave` (
  `parola` VARCHAR(15) NOT NULL,
  `articolo` INT NOT NULL,
  PRIMARY KEY (`parola`, `articolo`),
  INDEX `articolo2_idx` (`articolo` ASC) VISIBLE,
  CONSTRAINT `articolo2`
    FOREIGN KEY (`articolo`)
    REFERENCES `articolo` (`id_articolo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Autore
 CREATE TABLE `autore` (
  `id_autore` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cognome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_autore`));

#Scritto
CREATE TABLE `scritto` (
  `autore` INT NOT NULL,
  `articolo` INT NOT NULL,
  PRIMARY KEY (`autore`, `articolo`),
  INDEX `articolo3_idx` (`articolo` ASC) VISIBLE,
  CONSTRAINT `articolo3`
    FOREIGN KEY (`articolo`)
    REFERENCES `articolo` (`id_articolo`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `autore1`
    FOREIGN KEY (`autore`)
    REFERENCES `autore` (`id_autore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Tutorial
 CREATE TABLE `tutorial` (
  `id_tutorial` INT NOT NULL AUTO_INCREMENT,
  `titolo` VARCHAR(70) NOT NULL,
  `abstract` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id_tutorial`),
  CONSTRAINT `tutorial1`
    FOREIGN KEY (`id_tutorial`)
    REFERENCES `presentazione` (`id_presentazione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
 #Risorsa aggiuntiva
 CREATE TABLE `risorsa_aggiuntiva` (
  `id_risorsa` INT NOT NULL AUTO_INCREMENT,
  `link` VARCHAR(50) NOT NULL,
  `descrizione` VARCHAR(100) NULL,
  `usernameSpeaker` VARCHAR(45) NOT NULL,
  `tutorial` INT NOT NULL,
  PRIMARY KEY (`id_risorsa`),
  CONSTRAINT `speaker1`
    FOREIGN KEY (`usernameSpeaker`)
    REFERENCES `speaker` (`usernameSpeaker`),
  INDEX `tutorial2_idx` (`tutorial` ASC) VISIBLE,
  CONSTRAINT `tutorial2`
    FOREIGN KEY (`tutorial`)
    REFERENCES `tutorial` (`id_tutorial`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);