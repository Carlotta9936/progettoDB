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

#Creo il database
DROP SCHEMA IF  exists CONFVIRTUAL ;
CREATE SCHEMA  CONFVIRTUAL;

#Creo le tabelle
USE CONFVIRTUAL;
CREATE TABLE SPONSOR (
nome VARCHAR(50) PRIMARY KEY,
logo varchar(30)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE SPONSORIZZAZIONE(
importo float(8,2),
foreign key(anno) references CONFERENZA(anno),
FOREIGN KEY (acronimo) REFERENCES CONFERENZA(acronimo),
FOREIGN KEY (nome_sponsor) REFERENCES SPONSOR(nome),
PRIMARY KEY (acronimo, anno, nome_sponsor)
) ENGINE = "InnoDB";

USE CONFIVIRTUAL;
CREATE TABLE CONFERENZA (
acronimo varchar(10),
anno year(4),
logo VARCHAR(30),
svolgimento enum("attiva","completata") default "attiva",
datainizio date not null,
datafine date  check (datafine > datainizio) not null,
totale_sponsorizzazioni int default (1) check(totale_sponsorizzazioni<6 and totale_sponsorizzazioni>0),
nome varchar(50),
FOREIGN KEY (creatore) REFERENCES AMMINISTRATORE(username),
PRIMARY KEY (acronimo, anno)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE PROGRAMMA_GIORNALIERO (
id_programma int auto_increment PRIMARY KEY,
#? data date,
foreign key(anno) references CONFERENZA(anno),
FOREIGN KEY (acronimo) REFERENCES CONFERENZA(acronimo)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE SESSIONE (
id_sessione INT AUTO_INCREMENT PRIMARY KEY,
ora_f time check (ora_f >ora_i ) not null,
ora_i time not null,
titolo varchar(100),
link varchar (50),
num_presentazioni int,
FOREIGN KEY (programma) REFERENCES PROGRAMMA_GIORNALIERO(id_programma)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE PRESENTAZIONE (
id_presentazione int auto_increment PRIMARY KEY,
ora_f time check (ora_f >ora_i ) not null,
ora_i time not null,
ordine int not null check (ordine<4),
foreign key(sessione) references SESSIONE(id_sessione)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE ARTICOLO (
pdf varchar(70),
stato enum ('coperto','non coperto') not null,
n_pagine int check(n_pagine>0),
foreign key(articolo) references PRESENTAZIONE(id_presentazione),
foreign key(presenter) references PRESENTER(username),
PRIMARY KEY (articolo)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE CHIAVE (
parola varchar(30),
foreign key(articolo) references ARTICOLO(articolo),
PRIMARY KEY (parola, articolo)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE SCRITTO(
foreign key(articolo) references ARTICOLO(articolo),
foreign key(autore) references AUTORE(id_autore),
PRIMARY KEY (autore,articolo)
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE AUTORE (
nome varchar(30),
cognome varchar(30),
id_autore int auto_increment primary key
) ENGINE = "InnoDB";

USE CONFVIRTUAL;
CREATE TABLE TUTORIAL (
titolo varchar (50) not null,
abstract varchar (500),
foreign key(tutorial) references PRESENTAZIONE(id_presentazione),
PRIMARY KEY (tutorial)
) ENGINE = "InnoDB";


USE CONFVIRTUAL;
CREATE TABLE RISORSA_AGGIUNTIVA (
id_risorsa int auto_increment primary key,
link varchar (50) not null,
descrizione varchar (100),
foreign key(speaker) references SPEAKER(speaker),
foreign key(tutorial) references TUTORIAL(tutorial)
) ENGINE = "InnoDB";
