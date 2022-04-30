DELIMITER $$
CREATE PROCEDURE `addadminconferenza` (user varchar(30), anno int, acronimo varchar(10))
BEGIN
	insert into iscrizione (iscrizione_anno,iscrizione_acronimo,iscrizione_username) values (anno, acronimo, user);
END$$DELIMITER $$
CREATE PROCEDURE `addPresenter` (user varchar(30), articolo int)
BEGIN
	UPDATE `confvirtual`.`articolo` SET `usernamePresenter` = user WHERE (`id_articolo` = articolo);

END$$DELIMITER $$
CREATE PROCEDURE `aggiornaInfo` (Nusername varchar(30), Npassword varchar(60), Nnome varchar(40), Ncognome varchar(40), nluogo_nascita varchar(40), ndata_nascita Date)
BEGIN
	UPDATE `utente` SET `username` = Nusername, `password` = Npassword, `nome` = Nnome, `cognome` = Ncognome, `luogo_nascita` = nluogo_nascita, `data_nascita` = ndata_nascita WHERE (`username` = Nusername);
END$$DELIMITER $$
CREATE PROCEDURE `aggiornaInfoPS`(tabella varchar(30), user varchar(30), uni varchar(30), dip varchar(30), cuv varchar(30), photo varchar(30))
BEGIN  
	if tabella = "presenter" then
		UPDATE Presenter SET `universita` = uni, `dipartimento` = dip, `cv` = cuv, `foto` = photo WHERE (`usernamePresenter` = user);
    else
		UPDATE Speaker SET `universita` = uni, `dipartimento` = dip, `cv` = cuv, `foto` = photo WHERE (`usernameSpeaker` = user);
    end if;
END$$DELIMITER $$
CREATE PROCEDURE `aggiungiAssociazioni`(user varchar(30), anno int, acronimo varchar(10))
BEGIN
    INSERT INTO `associazione` (`associazione_anno`, `associazione_acronimo`, `associazione_username`) VALUES (anno, acronimo, user);
END$$DELIMITER $$
CREATE PROCEDURE `articoloSessionePresentazione`(id_sessione int)
BEGIN
	(select articolo.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione, articolo.id_articolo as id, "articolo" as tipo
	from articolo, sessione, presentazione
	where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione and articolo.id_articolo=presentazione.id_presentazione)
    union
	(select tutorial.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione,  tutorial.id_tutorial as id, "tutorial" as tipo
	from tutorial, sessione, presentazione
	
    where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione and tutorial.id_tutorial=presentazione.id_presentazione);
END$$DELIMITER $$
CREATE PROCEDURE `autenticazione`(name varchar(30), pass varchar(60))
BEGIN
	SELECT * FROM utente WHERE username = name AND password = pass;
END$$
DELIMITER $$

CREATE PROCEDURE `autorecreato`()
BEGIN
	
    select max(id_autore) as autore from autore;
END$$DELIMITER $$
CREATE PROCEDURE `autorepresenter`(in nome varchar(45),in cognome varchar(45))
BEGIN
	insert into autore (nome, cognome, presenter) values (nome, cognome, 1);
END$$DELIMITER $$
CREATE PROCEDURE `cercaconferenza`(in anno year(4),in acronimo varchar(10))
BEGIN
	select *
    from conferenza
    where conferenza.anno= anno and conferenza.acronimo=acronimo;
    
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE conferenze(username varchar(30))
BEGIN
	SELECT nome, acronimo, anno, datainizio, datafine
	FROM conferenza JOIN iscrizione on (conferenza.anno = iscrizione.iscrizione_anno AND conferenza.acronimo = iscrizione.iscrizione_acronimo)
	WHERE iscrizione_username = username;
END$$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `conferenzedisponibili`()
BEGIN
	select conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.datainizio as datainizio, conferenza.datafine as datafine
	from conferenza
	where conferenza.svolgimento='attiva';
END$$DELIMITER $$
CREATE PROCEDURE conferenzePreferite (username varchar(30))
BEGIN
	SELECT conferenza.nome as nome, conferenza.acronimo as acronimo, conferenza.anno as anno, conferenza.dataInizio as datainizio, conferenza.dataFine as datafine
	FROM conferenza inner join iscrizione on (conferenza.anno = iscrizione.iscrizione_anno and conferenza.acronimo = iscrizione.iscrizione_acronimo)
	WHERE iscrizione_username = username;
END$$

DELIMITER ;DELIMITER $$
CREATE PROCEDURE `contasponsor`(in anno int,in acronimo varchar(10))
BEGIN
	select count(nome_sponsor)as num_sponsorizzazioni
	from sponsorizzazione
    where annoConf=anno and acronimoConf=acronimo
	group by annoConf, acronimoConf;
    
END$$DELIMITER $$
CREATE  PROCEDURE `controllaiscrizione`(user varchar(30), anno int, acronimo varchar(10))
BEGIN
	select iscrizione.iscrizione_username
    from iscrizione
    where iscrizione.iscrizione_username=user and iscrizione.iscrizione_anno=anno and iscrizione.iscrizione_acronimo=acronimo;
END$$DELIMITER $$
CREATE PROCEDURE `controlloRuoli`(name varchar(30))
BEGIN
	select ruolo
	from ruoli
    where username=name;
END$$DELIMITER $$
CREATE PROCEDURE creaSessione (oraF time, oraI time, titolo varchar(100), link varchar(50), num int, programma int)
BEGIN
	INSERT INTO sessione(ora_f, ora_i, titolo, link, num_presentazioni, programma) VALUES (oraF, oraI, titolo, link, num, programma);
END$$
DELIMITER $$
CREATE PROCEDURE `datiConferenza`(anno int, acronimo varchar(30))
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
END$$drop event conferenzeCompletate; 
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
END$$DELIMITER $$
CREATE PROCEDURE `getAdminLiberi`(anno int, acronimo varchar(10))
BEGIN
	SELECT * 
	FROM confvirtual.amministratore
	where usernameAdmin not in ( select associazione_username
									from associazione
									where associazione_acronimo=acronimo and associazione_anno=anno);
END$$DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAssociati`(anno int, acronimo varchar(10))
BEGIN
	select associazione_username
    from associazione
    where associazione_anno = anno and associazione_acronimo = acronimo;
END$$DELIMITER $$
CREATE PROCEDURE `getCV` (name varchar(30))
BEGIN
	select cv
    from presenterespeaker
    where username = name;
END$$

DELIMITER ;DELIMITER $$
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
    
END$$DELIMITER $$
CREATE  PROCEDURE `getPresentazioni`(numSessione int)
BEGIN
	select presentazione.ora_i as oraInizio, presentazione.ora_f as oraFine
	from sessione, presentazione
	where id_sessione = sessione and sessione = numSessione;
    
END$$DELIMITER $$
CREATE PROCEDURE `getProgrammaGiornaliero`(anno int, acronimo varchar(10))
BEGIN
	select data, programma_giornaliero.anno as anno,programma_giornaliero.acronimo as acronimo
    from programma_giornaliero
   where programma_giornaliero.anno = anno and programma_giornaliero.acronimo = acronimo;
END$$DELIMITER $$
CREATE PROCEDURE `getRisorseAggiuntive` (idTutorial int)
BEGIN
	select link, descrizione, id_risorsa
    from risorsa_aggiuntiva
    where tutorial = idTutorial;
END$$DELIMITER $$
CREATE PROCEDURE `getSessione`(id int)
BEGIN
	select *
    from conferenza
    where id_conferenza = id;
END$$
DELIMITER $$
CREATE PROCEDURE `informazioniIniziali`()
BEGIN
	SELECT count(*) as numUtenti FROM utente; 
	SELECT count(*) as numConferenze FROM conferenza;
	SELECT count(*) as numConferenzeAttive FROM conferenza WHERE svolgimento = "Attiva";
END$$
DELIMITER $$
CREATE PROCEDURE informazioniPersonali(username varchar(30))
BEGIN
	SELECT username, nome, cognome, luogo_nascita, data_nascita FROM utente WHERE username = username;
END$$DELIMITER $$
CREATE PROCEDURE inserisciNuovoUtente (username varchar(30), password varchar(60), nome varchar(45), cognome varchar(45), luogoNascita varchar(45), dataNascita DATETIME)
BEGIN
	INSERT INTO utente (username, password, nome, cognome, luogo_nascita, data_nascita) 
	VALUES (username, password, nome, cognome, luogoNascita, dataNascita);
END$$DELIMITER $$
CREATE PROCEDURE `insertarticolo`(in id_articolo int, in pdf varchar(70),in n_pagine int,in  titolo varchar(70))
BEGIN
	
    INSERT INTO articolo(id_articolo, pdf , stato,n_pagine, titolo) VALUES (id_articolo, pdf ,'non coperto',n_pagine, titolo);
END$$DELIMITER $$
CREATE PROCEDURE `insertautore`(in nome varchar(45),in  cognome varchar(45))
BEGIN
	
    INSERT INTO autore(nome, cognome) VALUES (nome, cognome);
END$$DELIMITER $$
CREATE PROCEDURE `insertconferenza`(in acronimo varchar (10) , in anno year(4) , in logo varchar (50) ,in datainizio date ,in datafine date,in nome varchar(50),in creatore varchar (45))
BEGIN
	
    INSERT INTO conferenza(acronimo, anno, logo, datainizio, datafine, nome, creatore) VALUES (acronimo, anno, logo, datainizio, datafine, nome, creatore);
    call aggiungiAssociazioni(creatore, anno, acronimo);
END$$DELIMITER $$
CREATE PROCEDURE `insertmessaggio` (in ora time(4), in sessione int,in user varchar(30),in testo varchar(500),in giorno date)
BEGIN
	insert into messaggio(ora,sessione,username,testo,data)values(ora,sessione,user,testo,giorno);
END$$DELIMITER $$
CREATE PROCEDURE `insertparola`(in newparola varchar(15),in newarticolo int)
BEGIN
    insert into chiave (parola,articolo) values (newparola, newarticolo);
END$$DELIMITER $$
CREATE PROCEDURE `insertPreferiti` (in id int,in user varchar(30))
BEGIN
	insert into preferiti (preferiti_presentazione, preferiti_username) values (id, user);
END$$DELIMITER $$
CREATE PROCEDURE `insertpresenta` (in username varchar(30), in tutorial int)
BEGIN
	insert into presenta (presenta_usernameSpeaker, tutorial) values (username, tutorial);
END$$DELIMITER $$
CREATE PROCEDURE `insertpresentazione`(in ora_i time(4),in  ora_f time(4),in  ordine int,in sessione int)
BEGIN
	
    INSERT INTO presentazione(ora_i, ora_f, ordine, sessione) VALUES (ora_i, ora_f,ordine,sessione);
END$$DELIMITER $$
CREATE PROCEDURE `insertprogramma`( acronimo varchar(10),  anno year(4),  data date)
BEGIN
	
    INSERT INTO programma_giornaliero(acronimo, anno, data) VALUES (acronimo, anno , data);
END$$
DELIMITER $$
CREATE PROCEDURE `insertrisorsa`(in link varchar(50),in  descrizione varchar(100),in tutorial int,in speaker varchar(45))
BEGIN
    insert into risorsa_aggiuntiva (link, descrizione,tutorial, usernameSpeaker) values (link, descrizione, tutorial, speaker);
END$$DELIMITER $$
CREATE PROCEDURE `insertscritto`(in autore int, in articolo int)
BEGIN
    INSERT INTO scritto(autore, articolo) VALUES (autore, articolo);
END$$DELIMITER $$
CREATE PROCEDURE `insertsegui`(in anno year(4),in  acronimo varchar (10),in  iscrizione_username varchar(45))
BEGIN
    INSERT INTO iscrizione (iscrizione_anno, iscrizione_acronimo, iscrizione_username) VALUES (anno, acronimo, iscrizione.username);
END$$DELIMITER $$
CREATE PROCEDURE `insertsessione`(in ora_f time,in ora_i time ,in titolo varchar(100), in link varchar (50), in programma int)
BEGIN
	INSERT INTO sessione(ora_f, ora_i, titolo, link, programma) VALUES (ora_f, ora_i, titolo, link, programma);
END$$DELIMITER $$
CREATE PROCEDURE `insertsponsor`(in nome varchar (50), in logo varchar (30))
BEGIN
    INSERT INTO sponsor(nome, logo) VALUES (nome , logo);
END$$DELIMITER $$
CREATE PROCEDURE `insertsponsorizzazione`(in importo float(8,2),in annoConf int,in acronimoConf varchar(10),in nome_sponsor varchar(50))
BEGIN
    INSERT INTO sponsorizzazione(importo, annoConf, acronimoConf, nome_sponsor) VALUES (importo, annoConf, acronimoConf, nome_sponsor);
END$$DELIMITER $$
CREATE PROCEDURE `inserttutorial` (in id int, in titolo varchar(70), abstract varchar(500))
BEGIN
	insert into tutorial (id_tutorial, titolo, abstract) values (id,titolo, abstract);
END$$DELIMITER $$
CREATE PROCEDURE `isarticolo` (in id int)
BEGIN
	select id_articolo
    from articolo
    where id_articolo=id;
END$$DELIMITER $$
CREATE PROCEDURE `isPreferita` (in user varchar(30), in id int)
BEGIN
	select *
    from preferiti
    where preferiti_username=user and preferiti_presentazione=id;
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `nomesponsor`(acronimo varchar(10), anno int)
BEGIN
	SELECT nome
	FROM confvirtual.sponsor 
	WHERE nome not in (
		SELECT nome_sponsor
		FROM confvirtual.sponsorizzazione 
		WHERE acronimoConf=acronimo and annoConf=anno);
END$$DELIMITER $$
CREATE PROCEDURE `orariSessione` (in id int)
BEGIN
	select ora_f, ora_i
    from sessione
    where sessione.programma=id;
END$$DELIMITER $$
CREATE PROCEDURE `presentazioneFromSessione` (id_sessione int)
BEGIN
	select *
    from presentazione, sessione
    where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione;
END$$
DELIMITER $$
CREATE PROCEDURE `presentazioneInConferenza	` (in id_pres int)
BEGIN
	select programma_giornaliero.anno as anno, programma_giornaliero.acronimo as acronimo
    from presentazione inner join sessione on(presentazione.sessione=sessione.id_sessione) inner join programma_giornaliero on(sessione.programma=programma_giornaliero.id_programma)
    where presentazione.id_presentazione=id_pres;
END$$DELIMITER $$
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
    
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `ricercaConferenze`(ricerca varchar(40))
BEGIN
	(select nome, acronimo, anno
	from conferenza
	where nome = ricerca)
    union
	( select nome, acronimo, anno
	from conferenza
	where nome LIKE CONCAT('%', ricerca , '%'));
    
END$$DELIMITER $$
CREATE PROCEDURE `ricercaUtenti`(ricerca varchar(30))
BEGIN
	(select username, utente.nome as nome, utente.cognome as cognome
	from utente
	where username = ricerca)
    union
	( select username, utente.nome as nome, utente.cognome as cognome
	from utente
	where username LIKE CONCAT('%', ricerca , '%'));
    
END$$DELIMITER $$
CREATE PROCEDURE `selectarticolo`(in id int)
BEGIN
	select autore.nome as nome ,autore.cognome as cognome, articolo, pdf, stato, n_pagine, titolo, articolo.usernamePresenter as presenter
    from scritto inner join autore on (autore=id_autore) ,articolo left join presenter on (articolo.usernamePresenter=presenter.usernamePresenter)
    where id_articolo=id and id_articolo=scritto.articolo;
END$$DELIMITER $$
CREATE PROCEDURE `selectpresenter`()
BEGIN
	select massimo, usernamePresenter
    from presenter, maxid_presenter
    where massimo=id_presenter;
    
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `selectutente` (in utente varchar(30))
BEGIN
	select nome, cognome
    from utente
    where username=utente;
END$$DELIMITER $$
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
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `specificasessione`(in sessione int)
BEGIN
	select sessione.titolo as sessione, conferenza.anno as anno, conferenza.acronimo as acronimo,
    programma_giornaliero.data as data, sessione.id_sessione as id
    from sessione, conferenza, programma_giornaliero
    where sessione.programma=programma_giornaliero.id_programma and
    programma_giornaliero.anno=conferenza.anno and conferenza.acronimo=programma_giornaliero.acronimo 
   
   and sessione.id_sessione=sessione;
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `titoloarticolo` (id int)
BEGIN
	select	articolo.titolo
    from articolo
    where articolo.id_articolo=id;
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `updateSpeaker`(username varchar(30), uni varchar(50), dip varchar(50), img varchar(50), curriculum varchar(50))
BEGIN
	INSERT INTO speaker (usernameSpeaker, universita, dipartimento, foto, cv) VALUES (username, uni, dip, img, curriculum);
    
    
END$$
DELIMITER $$
CREATE PROCEDURE `updateSpeaker`(username varchar(30), uni varchar(50), dip varchar(50), img varchar(50), curriculum varchar(50))
BEGIN
	INSERT INTO speaker (usernameSpeaker, universita, dipartimento, foto, cv) VALUES (username, uni, dip, img, curriculum);
    
END$$
DELIMITER $$
CREATE PROCEDURE `uploadRisorsaAggiuntiva` (idRisorsaN int, linkN varchar (30), descrizioneN varchar(30))
BEGIN
	UPDATE risorsa_aggiuntiva SET link = linkN, descrizione = descrizioneN WHERE (id_risorsa = id_RisorsaN);
END$$

DELIMITER ;DELIMITER $$
CREATE PROCEDURE `verificaconferenza`(in anno int,in acronimo varchar(10))
BEGIN
	select *
    from conferenza
    where conferenza.svolgimento='attiva' and conferenza.anno= anno and conferenza.acronimo=acronimo;
    
END$$
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `verificaorariosessione`(in id int)
BEGIN
	select sessione.ora_f as oraf, sessione.ora_i as orai, programma_giornaliero.data as data
    from sessione, conferenza, programma_giornaliero
    where sessione.id_sessione=id and sessione.programma=programma_giornaliero.id_programma and programma_giornaliero.anno=conferenza.anno and
    programma_giornaliero.acronimo=conferenza.acronimo;
END$$DELIMITER $$
CREATE PROCEDURE `verificaspeaker` ()
BEGIN
	select *
    from speaker;
END$$DELIMITER $$
CREATE PROCEDURE `visualizzaautori`()
BEGIN
	select * from autore where presenter=0;
END$$DELIMITER $$
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
END$$DELIMITER $$
CREATE PROCEDURE `visualizzasponsor`(in anno year(4), in acronimo varchar(10))
BEGIN
	select sponsor.nome
	from conferenza, sponsor, sponsorizzazione
	where conferenza.svolgimento='attiva' 
    and conferenza.anno= anno
	and conferenza.acronimo= acronimo
	and conferenza.anno=sponsorizzazione.annoConf 
	and conferenza.acronimo=sponsorizzazione.acronimoConf
	and sponsorizzazione.nome_sponsor=sponsor.nome;
                        
END$$DELIMITER $$
CREATE PROCEDURE `vota`(username varchar(30), presentazione int, voto int)
BEGIN
	insert into valutazione (valutazione_admin, valutazione_presentazione, valutazione) values (username, presentazione, voto);
    
END$$