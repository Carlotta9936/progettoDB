DELIMITER $$
CREATE PROCEDURE `presentazioneFromSessione` (id_sessione int)
BEGIN
	select *
    from presentazione, sessione
    where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione;
END$$
