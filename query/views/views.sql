CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `maxid_presenter` AS
    SELECT 
        MAX(`presenter`.`id_presenter`) AS `massimo`
    FROM
        `presenter`CREATE VIEW `presentazioneinconferenza` AS
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
	select *
	FROM presenter);
USE `confvirtual`;
CREATE 
    VIEW `ruoli` AS
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
            `presenter`;CREATE VIEW `votiEvotati` AS
    (select valutazione.valutazione as voto, presenta.presenta_usernameSpeaker as votato
    from valutazione, presenta
    where valutazione.valutazione_presentazione = presenta.tutorial)
    union
    (select valutazione.valutazione as voto, articolo.usernamePresenter as votato
    from valutazione, articolo
    where valutazione.valutazione_presentazione = articolo.id_articolo);