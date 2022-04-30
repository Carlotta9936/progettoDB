drop schema if exists confvirtual;
create schema confvirtual;
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
  `id_presenter` INT NOT NULL,
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

#Conferenza
 CREATE TABLE `conferenza` (
  `acronimo` VARCHAR(10) NOT NULL,
  `anno` YEAR(4) NOT NULL,
  `logo` VARCHAR(30) NULL,
  `svolgimento` ENUM('attiva', 'completata') NOT NULL,
  `datainizio` DATE NOT NULL,
  `datafine` DATE NOT NULL,
  `totale_sponsorizzazioni` INT NOT NULL DEFAULT 0,
  `nome` VARCHAR(50) NOT NULL,
  `creatore` VARCHAR(45) NOT NULL,
  INDEX `anno_idx` (`anno` ASC) VISIBLE,
  PRIMARY KEY (`acronimo`, `anno`));

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
  `num_presentazioni` INT NOT NULL DEFAULT 0,
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

#Articolo
CREATE TABLE `articolo` (
  `id_articolo` INT NOT NULL,
  `pdf` VARCHAR(70) NOT NULL,
  `titolo` VARCHAR(70) NOT NULL,
  `stato` ENUM('coperto', 'non coperto') default 'non coperto',
  `n_pagine` INT not NULL,
  `usernamePresenter` VARCHAR(45) default NULL,
  PRIMARY KEY (`id_articolo`),
  CONSTRAINT `presenter1`
    FOREIGN KEY (`usernamePresenter`)
    REFERENCES `presenter` (`usernamePresenter`),
  CONSTRAINT `articolo1`
    FOREIGN KEY (`id_articolo`)
    REFERENCES `presentazione` (`id_presentazione`)
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
CREATE TABLE `valutazione`(
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
CREATE TABLE `iscrizione` (
  `idIscrizione` int NOT NULL AUTO_INCREMENT,
  `iscrizione_anno` year DEFAULT NULL,
  `iscrizione_acronimo` varchar(45) DEFAULT NULL,
  `iscrizione_username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idIscrizione`),
  KEY `iscrizione_anno` (`iscrizione_anno`),
  KEY `iscrizione_acronimo` (`iscrizione_acronimo`),
  KEY `iscrizione_username` (`iscrizione_username`),
  CONSTRAINT `iscrizione_acronimo` FOREIGN KEY (`iscrizione_acronimo`) REFERENCES `conferenza` (`acronimo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `iscrizione_anno` FOREIGN KEY (`iscrizione_anno`) REFERENCES `conferenza` (`anno`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `iscrizione_username` FOREIGN KEY (`iscrizione_username`) REFERENCES `utente` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    
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
  `presenter` TINYINT NULL DEFAULT 0,
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
    
   #Messaggio
    CREATE TABLE `confvirtual`.`messaggio` (
  `id_messaggio` INT NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  `sessione` INT NOT NULL,
  `data` DATE NOT NULL,
  `ora` TIME NOT NULL,
  `testo` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id_messaggio`),
  INDEX `sessione_idx` (`sessione` ASC) VISIBLE,
  INDEX `username_idx` (`username` ASC) VISIBLE,
  CONSTRAINT `sessione`
    FOREIGN KEY (`sessione`)
    REFERENCES `confvirtual`.`sessione` (`id_sessione`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `username`
    FOREIGN KEY (`username`)
    REFERENCES `confvirtual`.`utente` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
DELIMITER $$
CREATE PROCEDURE `addadminconferenza` (user varchar(30), anno int, acronimo varchar(10))
BEGIN
	insert into iscrizione (iscrizione_anno,iscrizione_acronimo,iscrizione_username) values (anno, acronimo, user);
END$$

DELIMITER $$
CREATE PROCEDURE `addPresenter` (user varchar(30), articolo int)
BEGIN
	UPDATE `confvirtual`.`articolo` SET `usernamePresenter` = user WHERE (`id_articolo` = articolo);

END$$

DELIMITER $$
CREATE PROCEDURE `aggiornaInfo` (Nusername varchar(30), Npassword varchar(60), Nnome varchar(40), Ncognome varchar(40), nluogo_nascita varchar(40), ndata_nascita Date)
BEGIN
	UPDATE `utente` SET `username` = Nusername, `password` = Npassword, `nome` = Nnome, `cognome` = Ncognome, `luogo_nascita` = nluogo_nascita, `data_nascita` = ndata_nascita WHERE (`username` = Nusername);
END$$

DELIMITER $$
CREATE PROCEDURE `aggiornaInfoPS`(tabella varchar(30), user varchar(30), uni varchar(30), dip varchar(30), cuv varchar(30), photo varchar(30))
BEGIN  
	if tabella = "presenter" then
		UPDATE Presenter SET `universita` = uni, `dipartimento` = dip, `cv` = cuv, `foto` = photo WHERE (`usernamePresenter` = user);
    else
		UPDATE Speaker SET `universita` = uni, `dipartimento` = dip, `cv` = cuv, `foto` = photo WHERE (`usernameSpeaker` = user);
    end if;
END$$ 

DELIMITER $$
CREATE PROCEDURE `aggiungiAssociazioni`(user varchar(30), anno int, acronimo varchar(10))
BEGIN
    INSERT INTO `associazione` (`associazione_anno`, `associazione_acronimo`, `associazione_username`) VALUES (anno, acronimo, user);
END$$ 

DELIMITER $$
CREATE PROCEDURE `articoloSessionePresentazione`(id_sessione int)
BEGIN
	(select articolo.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione, articolo.id_articolo as id, "articolo" as tipo
	from articolo, sessione, presentazione
	where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione and articolo.id_articolo=presentazione.id_presentazione)
    union
	(select tutorial.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione,  tutorial.id_tutorial as id, "tutorial" as tipo
	from tutorial, sessione, presentazione
    where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione and tutorial.id_tutorial=presentazione.id_presentazione)
    order by orai;
END$$ 

DELIMITER $$
CREATE PROCEDURE `autenticazione`(name varchar(30), pass varchar(60))
BEGIN
	SELECT * FROM utente WHERE username = name AND password = pass;
END$$


DELIMITER $$
CREATE PROCEDURE `autorecreato`()
BEGIN
	
    select max(id_autore) as autore from autore;
END$$ 

DELIMITER $$
CREATE PROCEDURE `autorepresenter`(in nomeN varchar(45),in cognomeN varchar(45))
BEGIN
	insert into autore (nome, cognome, presenter) values (nomeN, cognomeN, 1);
    select id_autore from auotre where nomeN=nome and congnome=cognomeN;
END$$ 

DELIMITER $$
CREATE PROCEDURE `cercaconferenza`(in anno int,in acronimo varchar(10))
BEGIN
	select *
    from conferenza
    where conferenza.anno= anno and conferenza.acronimo=acronimo;
    
END$$ 

DELIMITER $$
CREATE PROCEDURE `classificaPresentatori`()
BEGIN
	select votato, avg(voto) as mediaVoto
	from votiEvotati
	group by votato
	order by mediaVoto
	DESC
	LIMIT 5;
END$$


DELIMITER $$
CREATE PROCEDURE classificaPresentazioni ()
BEGIN
	select acronimo, anno, nome, count(*) as conta
	from presentazioneinconferenza inner join preferiti on (presentazioneinconferenza.idPresentazione = preferiti.preferiti_presentazione)
	group by acronimo, anno
	order by conta
	DESC
	LIMIT 5;
END$$ 

DELIMITER $$
CREATE PROCEDURE conferenze(username varchar(30))
BEGIN
	SELECT nome, acronimo, anno, datainizio, datafine
	FROM conferenza JOIN iscrizione on (conferenza.anno = iscrizione.iscrizione_anno AND conferenza.acronimo = iscrizione.iscrizione_acronimo)
	WHERE iscrizione_username = username;
END$$


DELIMITER $$
CREATE PROCEDURE `conferenzedisponibili`()
BEGIN
	select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.datainizio as datainizio, conferenza.datafine as datafine
	from conferenza
	where conferenza.svolgimento='attiva';
END$$ 

DELIMITER $$
CREATE PROCEDURE `conferenzePreferite` (username varchar(30))
BEGIN
	SELECT conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.dataInizio as datainizio, conferenza.dataFine as datafine
	FROM conferenza inner join iscrizione on (conferenza.anno = iscrizione.iscrizione_anno and conferenza.acronimo = iscrizione.iscrizione_acronimo)
	WHERE iscrizione_username = username and conferenza.svolgimento="attiva";
END$$

DELIMITER $$
CREATE PROCEDURE `contasponsor`(in anno int,in acronimo varchar(10))
BEGIN
	select count(nome_sponsor)as num_sponsorizzazioni
	from sponsorizzazione
    where annoConf=anno and acronimoConf=acronimo
	group by annoConf, acronimoConf;
END$$ 

DELIMITER $$
CREATE  PROCEDURE `controllaiscrizione`(user varchar(30), anno int, acronimo varchar(10))
BEGIN
	select iscrizione.idIscrizione
    from iscrizione
    where iscrizione.iscrizione_username=user and iscrizione.iscrizione_anno=anno and iscrizione.iscrizione_acronimo=acronimo;
END$$ 

DELIMITER $$
CREATE PROCEDURE `controlloRuoli`(name varchar(30))
BEGIN
	select ruolo
	from ruoli
    where username=name;
END$$ 

DELIMITER $$
CREATE PROCEDURE creaSessione (oraF time, oraI time, titolo varchar(100), link varchar(50), num int, programma int)
BEGIN
	INSERT INTO sessione(ora_f, ora_i, titolo, link, num_presentazioni, programma) VALUES (oraF, oraI, titolo, link, num, programma);
END$$

DELIMITER $$
CREATE PROCEDURE `datiConferenza`(anno year(4), acronimo varchar(10))
BEGIN
	call specificaconferenza (anno, acronimo);
    call getAssociati (anno, acronimo);
    call getProgrammaGiornaliero (anno, acronimo);
    call getNumeroIscritti (anno, acronimo);
    call visualizzaSponsor (anno, acronimo);
END$$

DELIMITER $$
CREATE PROCEDURE eventiHype ()
BEGIN
	select count(*) as conta, iscrizione_acronimo, iscrizione_anno
	from iscrizione, conferenza
	WHERE iscrizione_acronimo = acronimo and iscrizione_anno = anno and svolgimento = "Attiva"
	group by iscrizione_anno, iscrizione_acronimo
	order by conta
	DESC
	LIMIT 5;
END$$

drop event conferenzeCompletate; 
set global event_scheduler = ON;
CREATE EVENT conferenzeCompletate   
  ON SCHEDULE
    EVERY '1' DAY
    STARTS '2022-04-01 00:00:01'
  DO
	#SET SQL_SAFE_UPDATES = 0;
	update conferenza set svolgimento = "Completata" where datafine < curdate();
    
DELIMITER $$
CREATE PROCEDURE `finepresentazione` (in id int)
BEGIN
	select programma_giornaliero.data as data, presentazione.ora_f as oraf
    from presentazione, sessione, programma_giornaliero
    where presentazione.id_presentazione=id and presentazione.sessione=sessione.id_sessione and sessione.programma=programma_giornaliero.id_programma;
END$$ 

DELIMITER $$
CREATE PROCEDURE `getAdminLiberi`(anno int, acronimo varchar(10))
BEGIN
	SELECT * 
	FROM confvirtual.amministratore
	where usernameAdmin not in ( select associazione_username
									from associazione
									where associazione_acronimo=acronimo and associazione_anno=anno);
END$$ 

DELIMITER $$
CREATE PROCEDURE `getAssociati`(anno int, acronimo varchar(10))
BEGIN
	select associazione_username
    from associazione
    where associazione_anno = anno and associazione_acronimo = acronimo;
END$$ 
#?
DELIMITER $$
CREATE PROCEDURE `getCV` (name varchar(30))
BEGIN
	select cv
    from presenterespeaker
    where username = name;
END$$

DELIMITER $$
CREATE PROCEDURE `getFilePersonali`(username varchar(50))
BEGIN
	(select cv as cv, foto as image
    from presenter
    where usernamePresenter = username)
    union
    (select cv as cv, foto as image
    from speaker
    where usernameSpeaker = username);
END$$

DELIMITER $$
CREATE PROCEDURE `getInfoPS` (nome varchar(30))
BEGIN
	select *
    from presenterespeaker
    where username = nome;
END$$


DELIMITER $$
CREATE PROCEDURE `getInformazioniPersonali`(username varchar(50))
BEGIN
	(select cv as cv, foto as image
    from presenter
    where usernamePresenter = username)
    union
    (select cv as cv, foto as image
    from speaker
    where usernameSpeaker = username);
END$$


DELIMITER $$
CREATE PROCEDURE `getNumeroIscritti`(anno int, acronimo varchar(30))
BEGIN
	select count(*) as numIscritti
	from iscrizione
	where iscrizione_acronimo=acronimo and iscrizione_anno = anno;
    
END$$ 

DELIMITER $$
CREATE  PROCEDURE `getPresentazioni`(numSessione int)
BEGIN
	select presentazione.ora_i as oraInizio, presentazione.ora_f as oraFine
	from sessione, presentazione
	where id_sessione = sessione and sessione = numSessione;
    
END$$ 

DELIMITER $$
CREATE PROCEDURE `getProgrammaGiornaliero`(anno int, acronimo varchar(10))
BEGIN
	select data
    from programma_giornaliero
   where programma_giornaliero.anno = anno and programma_giornaliero.acronimo = acronimo;
END$$ 

DELIMITER $$
CREATE PROCEDURE `getRisorseAggiuntive` (idTutorial int)
BEGIN
	select link, descrizione, id_risorsa
    from risorsa_aggiuntiva
    where tutorial = idTutorial;
END$$ 


DELIMITER $$
CREATE PROCEDURE `getSessione`(id int)
BEGIN
	select *
    from sessione
    where id_sessione = id;
END$$


DELIMITER $$
CREATE PROCEDURE `informazioniIniziali`()
BEGIN
	SELECT count(*) as numUtenti FROM utente; 
	SELECT count(*) as numConferenze FROM conferenza;
	SELECT count(*) as numConferenzeAttive FROM conferenza WHERE svolgimento = "Attiva";
END$$


DELIMITER $$
CREATE PROCEDURE informazioniPersonali(name varchar(30))
BEGIN
	SELECT username,password, nome, cognome, luogo_nascita, data_nascita FROM utente WHERE username = name;
END$$ 


DELIMITER $$
CREATE PROCEDURE inserisciNuovoUtente (username varchar(30), password varchar(60), nome varchar(45), cognome varchar(45), luogoNascita varchar(45), dataNascita DATETIME)
BEGIN
	INSERT INTO utente (username, password, nome, cognome, luogo_nascita, data_nascita) 
	VALUES (username, password, nome, cognome, luogoNascita, dataNascita);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertarticolo`(in id_articolo int, in pdf varchar(70),in n_pagine int,in  titolo varchar(70))
BEGIN
    INSERT INTO articolo(id_articolo, pdf , stato,n_pagine, titolo) VALUES (id_articolo, pdf ,'non coperto',n_pagine, titolo);
END$$


DELIMITER $$
CREATE PROCEDURE `insertautore`(in nome varchar(45),in  cognome varchar(45))
BEGIN
    INSERT INTO autore(nome, cognome) VALUES (nome, cognome);
END$$

DELIMITER $$
CREATE PROCEDURE `insertconferenza`(in acronimo varchar (10) , in anno year(4) , in logo varchar (50) ,in datainizio date ,in datafine date,in nome varchar(50),in creatore varchar (45))
BEGIN
    INSERT INTO conferenza(acronimo, anno, logo, datainizio, datafine, nome, creatore) VALUES (acronimo, anno, logo, datainizio, datafine, nome, creatore);
    call aggiungiAssociazioni(creatore, anno, acronimo);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertmessaggio` (in ora time(4), in sessione int,in user varchar(30),in testo varchar(500),in giorno date)
BEGIN
	insert into messaggio(ora,sessione,username,testo,data)values(ora,sessione,user,testo,giorno);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertparola`(in newparola varchar(15),in newarticolo int)
BEGIN
    insert into chiave (parola,articolo) values (newparola, newarticolo);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertPreferiti` (in id int,in user varchar(30))
BEGIN
	insert into preferiti (preferiti_presentazione, preferiti_username) values (id, user);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertpresenta` (in username varchar(30), in tutorial int)
BEGIN
	insert into presenta (presenta_usernameSpeaker, tutorial) values (username, tutorial);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertpresentazione`(in ora_i time(4),in  ora_f time(4),in  ordine int,in sessione int)
BEGIN
    INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES (ora_i, ora_f,ordine,sessione);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertprogramma`( acronimo varchar(10),  anno year(4),  data date)
BEGIN
    INSERT INTO programma_giornaliero(acronimo, anno, data) VALUES (acronimo, anno , data);
END$$


DELIMITER $$
CREATE PROCEDURE `insertrisorsa`(in link varchar(50),in  descrizione varchar(100),in tutorial int,in speaker varchar(45))
BEGIN
    insert into risorsa_aggiuntiva (link, descrizione,tutorial, usernameSpeaker) values (link, descrizione, tutorial, speaker);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertscritto`(in autore int, in articolo int)
BEGIN
    INSERT INTO scritto(autore, articolo) VALUES (autore, articolo);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertsegui`(in anno year(4),in  acronimo varchar (10),in  username varchar(45))
BEGIN
    INSERT INTO iscrizione (iscrizione_anno, iscrizione_acronimo, iscrizione_username) VALUES (anno, acronimo, username);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertsessione`(in ora_f time,in ora_i time ,in titolo varchar(100), in link varchar (50), in programma int)
BEGIN
	INSERT INTO sessione(ora_f, ora_i, titolo, link, programma) VALUES (ora_f, ora_i, titolo, link, programma);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertsponsor`(in nome varchar (50), in logo varchar (30))
BEGIN
    INSERT INTO sponsor(nome, logo) VALUES (nome , logo);
END$$ 


DELIMITER $$
CREATE PROCEDURE `insertsponsorizzazione`(in importo float(8,2),in annoConf int,in acronimoConf varchar(10),in nome_sponsor varchar(50))
BEGIN
    INSERT INTO sponsorizzazione(importo, annoConf, acronimoConf, nome_sponsor) VALUES (importo, annoConf, acronimoConf, nome_sponsor);
END$$ 


DELIMITER $$
CREATE PROCEDURE `inserttutorial` (in id int, in titolo varchar(70), abstract varchar(500))
BEGIN
	insert into tutorial (id_tutorial, titolo, abstract) values (id,titolo, abstract);
END$$ 


DELIMITER $$
CREATE PROCEDURE `isarticolo` (in id int)
BEGIN
	select id_articolo
    from articolo
    where id_articolo=id;
END$$ 


DELIMITER $$
CREATE PROCEDURE `isPreferita` (in user varchar(30), in id int)
BEGIN
	select *
    from preferiti
    where preferiti_username=user and preferiti_presentazione=id;
END$$ 

#non serve
DELIMITER $$
CREATE PROCEDURE `ispresenter` (in id int)
BEGIN
	select *
    from presenter
    where id_presenter=id;
END$$


DELIMITER $$
CREATE PROCEDURE `istutorial` (in id int)
BEGIN
	select id_tutorial
    from tutorial
    where id_tutorial=id;
END$$ 


DELIMITER $$
CREATE PROCEDURE `nomesponsor`(acronimo varchar(10), anno int)
BEGIN
	SELECT nome
	FROM confvirtual.sponsor 
	WHERE nome not in (
		SELECT nome_sponsor
		FROM confvirtual.sponsorizzazione 
		WHERE acronimoConf=acronimo and annoConf=anno);
END$$ 


DELIMITER $$
CREATE PROCEDURE `nuovaRisorsaAggiuntiva`(link varchar(30), descrizione varchar(100), username varchar(30), tutorial int)
BEGIN
	INSERT INTO `risorsa_aggiuntiva` (`link`, `descrizione`, `usernameSpeaker`, `tutorial`) VALUES (link, descrizione, username, tutorial);
END$$


DELIMITER $$
CREATE PROCEDURE `orariSessione` (in id int)
BEGIN
	select ora_f, ora_i
    from sessione
    where sessione.programma=id;
END$$ 


DELIMITER $$
CREATE PROCEDURE `presentazioneFromSessione` (id_sessione int)
BEGIN
	select *
    from presentazione, sessione
    where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione;
END$$


DELIMITER $$
CREATE PROCEDURE `presentazioneInConferenza` (in id_pres int)
BEGIN
	select programma_giornaliero.anno as anno, programma_giornaliero.acronimo as acronimo
    from presentazione inner join sessione on(presentazione.sessione=sessione.id_sessione) inner join programma_giornaliero on(sessione.programma=programma_giornaliero.id_programma)
    where presentazione.id_presentazione=id_pres;
END$$ 


DELIMITER $$
CREATE PROCEDURE presentazioniPreferite(username varchar(30))
BEGIN
	select conferenza.nome as conferenzaNome, programma_giornaliero.data as programma_giornalieroData
	from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
	inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
	inner join presentazione on(sessione.id_sessione= presentazione.sessione)
	inner join preferiti on (presentazione.id_presentazione = preferiti.preferiti_presentazione)
	where preferiti.preferiti_username = username;
END$$


DELIMITER $$
CREATE PROCEDURE `presenterArticolo`(id int)
BEGIN
	SELECT usernamePresenter
	FROM presenter, scritto
	WHERE autore = id_presenter and articolo=id;
END$$ 


DELIMITER $$
CREATE PROCEDURE `puoVotare`(presentazione int)
BEGIN
	SELECT associazione_username as admins
	FROM associazione, presentazioneinconferenza
	WHERE associazione.associazione_acronimo = presentazioneinconferenza.acronimo 
	and associazione.associazione_anno = presentazioneinconferenza.anno 
    and presentazioneinconferenza.idPresentazione=presentazione 
    and associazione_username not in (select valutazione_admin
									from valutazione
									where valutazione_presentazione = presentazione);                      
END$$ 


DELIMITER $$
CREATE PROCEDURE `ricercaConferenze`(ricerca varchar(40))
BEGIN
	(select nome, acronimo, anno
	from conferenza
	where nome = ricerca)
    union
	( select nome, acronimo, anno
	from conferenza
	where nome LIKE CONCAT('%', ricerca , '%'));
    
END$$ 


DELIMITER $$
CREATE PROCEDURE `ricercaUtenti`(ricerca varchar(30))
BEGIN
	(select username, utente.nome as nome, utente.cognome as cognome
	from utente
	where username = ricerca)
    union
	( select username, utente.nome as nome, utente.cognome as cognome
	from utente
	where username LIKE CONCAT('%', ricerca , '%'));
    
END$$ 


DELIMITER $$
CREATE PROCEDURE `selectarticolo`(in id int)
BEGIN
	select autore.nome as nome ,autore.cognome as cognome, articolo, pdf, stato, n_pagine, titolo, articolo.usernamePresenter as presenter
    from scritto inner join autore on (autore=id_autore) ,articolo left join presenter on (articolo.usernamePresenter=presenter.usernamePresenter)
    where id_articolo=id and id_articolo=scritto.articolo;
END$$ 


DELIMITER $$
CREATE PROCEDURE `selectpresenter`()
BEGIN
	select massimo, usernamePresenter
    from presenter, maxid_presenter
    where massimo=id_presenter;
    
END$$ 


DELIMITER $$
CREATE  PROCEDURE `selectprogramma`( anno int, acronimo varchar(10))
BEGIN
	SELECT * 
    FROM programma_giornaliero 
    WHERE programma_giornaliero.anno=anno and programma_giornaliero.acronimo= acronimo;
    
END$$


DELIMITER $$
CREATE PROCEDURE `selecttutorial`(in id int)
BEGIN
	select tutorial.titolo, tutorial.abstract, speaker.usernameSpeaker as speaker
    from tutorial, presenta, speaker
    where id_tutorial=id and presenta.tutorial=id_tutorial and presenta.presenta_usernameSpeaker=speaker.usernameSpeaker;
END$$ 


DELIMITER $$
CREATE PROCEDURE `selectutente` (in utente varchar(30))
BEGIN
	select nome, cognome
    from utente
    where username=utente;
END$$ 


DELIMITER $$
CREATE  PROCEDURE `selezionapresentazione`()
BEGIN
	select max(presentazione.id_presentazione)as id
	from presentazione;
END$$


DELIMITER $$
CREATE PROCEDURE `sessionedata` (in sessione int)
BEGIN
	select programma_giornaliero.data as data
	from sessione, programma_giornaliero
    where sessione.id_sessione=sessione and sessione.programma=programma_giornaliero.id_programma;
END$$ 


DELIMITER $$
CREATE PROCEDURE `sessionidisponibili`()
BEGIN
	select sessione.titolo as sessione, conferenza.anno as anno, conferenza.acronimo as acronimo,
    programma_giornaliero.data as data, sessione.id_sessione as id
    from sessione, conferenza, programma_giornaliero
    where sessione.programma=programma_giornaliero.id_programma and
    programma_giornaliero.anno=conferenza.anno and conferenza.acronimo=programma_giornaliero.acronimo
    and conferenza.svolgimento='attiva';
END$$


DELIMITER $$
CREATE PROCEDURE `specificaconferenza`(in anno year(4),in acronimo varchar(10))
BEGIN
	select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno,
    conferenza.creatore as creatore, conferenza.datainizio as datainizio, conferenza.datafine as datafine,
    conferenza.logo as logo, programma_giornaliero.data as data, sessione.link as link, sessione.ora_i as orai, 
    sessione.titolo as titolosessione, sessione.ora_f as oraf, programma_giornaliero.data as data,
    sessione.id_sessione as sessione, conferenza.svolgimento as svolgimento
	from conferenza inner join programma_giornaliero on (conferenza.anno=programma_giornaliero.anno and conferenza.acronimo=programma_giornaliero.acronimo)
	inner join sessione on( programma_giornaliero.id_programma=sessione.programma)
	where conferenza.anno= anno and conferenza.acronimo= acronimo;
END$$


 DELIMITER $$
CREATE PROCEDURE `specificasessione`(in sessione int)
BEGIN
	select sessione.titolo as sessione, conferenza.anno as anno, conferenza.acronimo as acronimo,
    programma_giornaliero.data as data, sessione.id_sessione as id
    from sessione, conferenza, programma_giornaliero
    where sessione.programma=programma_giornaliero.id_programma and
    programma_giornaliero.anno=conferenza.anno and conferenza.acronimo=programma_giornaliero.acronimo 
   and sessione.id_sessione=sessione;
END$$ 


DELIMITER $$
CREATE PROCEDURE `sponsorconferenza`()
BEGIN
	SELECT * FROM sponsor;
    SELECT acronimo,anno FROM conferenza;
    
END$$


DELIMITER $$
CREATE PROCEDURE `stampamessaggi` (in id int)
BEGIN
	select username,ora,testo
    from messaggio
    where sessione=id;
END$$


 DELIMITER $$
CREATE PROCEDURE `titoloarticolo` (id int)
BEGIN
	select	articolo.titolo
    from articolo
    where articolo.id_articolo=id;
END$$


DELIMITER $$
CREATE PROCEDURE `trovaUtente`(user varchar(30))
BEGIN
	SELECT username 
    FROM utente 
    WHERE username = user;
    
END$$


DELIMITER $$
CREATE PROCEDURE updateAmministratore(username varchar(30))
BEGIN
	INSERT INTO amministratore (usernameAdmin) VALUES (username); 
END$$ 


DELIMITER $$
CREATE PROCEDURE `updatePresenter`(username varchar(30), uni varchar(50), dip varchar(50), img varchar(50), curriculum varchar(50), id int)
BEGIN
	INSERT INTO presenter (usernamePresenter, universita, dipartimento, foto, cv, id_presenter) VALUES (username, uni, dip, img, curriculum, id);
END$$


DELIMITER $$
CREATE PROCEDURE `updateSpeaker`(username varchar(30), uni varchar(50), dip varchar(50), img varchar(50), curriculum varchar(50))
BEGIN
	INSERT INTO speaker (usernameSpeaker, universita, dipartimento, foto, cv) VALUES (username, uni, dip, img, curriculum);
END$$


DELIMITER $$
CREATE PROCEDURE `uploadRisorsaAggiuntiva` (idRisorsaN int, linkN varchar (30), descrizioneN varchar(30))
BEGIN
	UPDATE risorsa_aggiuntiva SET link = linkN, descrizione = descrizioneN WHERE (id_risorsa = idRisorsaN);
END$$


DELIMITER $$
CREATE PROCEDURE `verificaconferenza`(in anno int,in acronimo varchar(10))
BEGIN
	select *
    from conferenza
    where conferenza.svolgimento='attiva' and conferenza.anno= anno and conferenza.acronimo=acronimo;
    
END$$


DELIMITER $$
CREATE PROCEDURE `verificaorariosessione`(in id int)
BEGIN
	select sessione.ora_f as oraf, sessione.ora_i as orai, programma_giornaliero.data as data
    from sessione, conferenza, programma_giornaliero
    where sessione.id_sessione=id and sessione.programma=programma_giornaliero.id_programma and programma_giornaliero.anno=conferenza.anno and
    programma_giornaliero.acronimo=conferenza.acronimo;
END$$ 


DELIMITER $$
CREATE PROCEDURE `verificaspeaker` ()
BEGIN
	select *
    from speaker;
END$$ 


DELIMITER $$
CREATE PROCEDURE `visualizzaautori`()
BEGIN
	select * from autore where presenter=0;
END$$


DELIMITER $$
CREATE PROCEDURE `visualizzaautoripresenter`()
BEGIN
	select * from autore where presenter=1;
END$$


DELIMITER $$
CREATE  PROCEDURE `visualizzapresentazione`(in newsessione int)
BEGIN
	select *
    from presentazione
    where sessione=newsessione;
END$$ 


DELIMITER $$
CREATE PROCEDURE `visualizzasponsor`(in anno year(4), in acronimo varchar(10))
BEGIN
	select sponsor.nome, sponsor.logo
	from conferenza, sponsor, sponsorizzazione
	where conferenza.svolgimento='attiva' 
    and conferenza.anno= anno
	and conferenza.acronimo= acronimo
	and conferenza.anno=sponsorizzazione.annoConf 
	and conferenza.acronimo=sponsorizzazione.acronimoConf
	and sponsorizzazione.nome_sponsor=sponsor.nome;
                        
END$$ 

DELIMITER $$
CREATE PROCEDURE `vota`(username varchar(30), presentazione int, voto int)
BEGIN
	insert into valutazione (valutazione_admin, valutazione_presentazione, valutazione) values (username, presentazione, voto);
END$$


DELIMITER $$
CREATE  TRIGGER `aggiornaNumeroPresentazioni` AFTER INSERT ON `presentazione` FOR EACH ROW BEGIN
	update sessione set num_presentazioni = num_presentazioni + 1 where id_sessione = NEW.sessione;
    
END$$


DELIMITER $$
CREATE TRIGGER `aggiornaNumeroPresentazioniCanc` AFTER DELETE ON `presentazione` FOR EACH ROW BEGIN
	update sessione set num_presentazioni = num_presentazioni - 1 where id_sessione = OLD.sessione;
    
END$$


DELIMITER $$
CREATE  TRIGGER `aggiornaStato` BEFORE UPDATE ON `articolo` FOR EACH ROW BEGIN
	if new.usernamePresenter is not null then
        SET new.stato= 'coperto' ;
    end if;
    
END$$


DELIMITER $$
CREATE TRIGGER `aggiuntasponsorizzazione` AFTER INSERT ON `sponsorizzazione` FOR EACH ROW BEGIN
	update conferenza set totale_sponsorizzazioni=totale_sponsorizzazioni+1
    where conferenza.acronimo=new.acronimoConf and conferenza.anno=new.annoConf;
END$$


CREATE VIEW `maxid_presenter` AS
    (SELECT 
        MAX(`presenter`.`id_presenter`) AS `massimo`
    FROM
        `presenter`) ;
        
        
CREATE VIEW `presentazioneinconferenza` AS
    SELECT 
        `conferenza`.`nome` AS `nome`,
        `conferenza`.`acronimo` AS `acronimo`,
        `conferenza`.`anno` AS `anno`,
        `conferenza`.`creatore` AS `creatore`,
        `conferenza`.`datainizio` AS `datainizio`,
        `conferenza`.`datafine` AS `datafine`,
        `conferenza`.`logo` AS `logo`,
        `programma_giornaliero`.`data` AS `data`,
        `sessione`.`link` AS `link`,
        `sessione`.`ora_i` AS `ora_i`,
        `sessione`.`ora_f` AS `ora_f`,
        `presentazione`.`id_presentazione` AS `idPresentazione`
        
    FROM
        (((`conferenza`
        JOIN `programma_giornaliero` ON (((`conferenza`.`anno` = `programma_giornaliero`.`anno`)
            AND (`conferenza`.`acronimo` = `programma_giornaliero`.`acronimo`))))
        JOIN `sessione` ON ((`programma_giornaliero`.`id_programma` = `sessione`.`programma`)))
        JOIN `presentazione` ON ((`sessione`.`id_sessione` = `presentazione`.`sessione`)));
    
    
CREATE  OR REPLACE VIEW `PresenterESpeaker` AS
	(SELECT * 
	FROM speaker
	) union (
	select usernamePresenter, universita, dipartimento, cv, foto
	FROM presenter);
    
    
CREATE VIEW `ruoli` AS
        SELECT 
            `amministratore`.`usernameAdmin` AS `username`,
            'Admin' AS `ruolo`
        FROM
            `amministratore` 
        UNION SELECT 
            `speaker`.`usernameSpeaker` AS `username`,
            'Speaker' AS `ruolo`
        FROM
            `speaker` 
        UNION SELECT 
            `presenter`.`usernamePresenter` AS `username`,
            'Presenter' AS `ruolo`
            
        FROM
            `presenter`;
     
     
	CREATE VIEW `votiEvotati` AS
    (select valutazione.valutazione as voto, presenta.presenta_usernameSpeaker as votato
    from valutazione, presenta
    where valutazione.valutazione_presentazione = presenta.tutorial)
    union
    (select valutazione.valutazione as voto, articolo.usernamePresenter as votato
    from valutazione, articolo
    where valutazione.valutazione_presentazione = articolo.id_articolo);