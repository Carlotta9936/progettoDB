DELIMITER $$

CREATE PROCEDURE `articoloSessionePresentazione`(id_sessione int)
BEGIN
	(select articolo.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione, articolo.id_articolo as id
	from articolo, sessione, presentazione
	where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione and articolo.id_articolo=presentazione.id_presentazione)
    union
	(select tutorial.titolo as titolo, presentazione.ora_f as oraf, presentazione.ora_i as orai, sessione.titolo as titolosessione,  tutorial.id_tutorial as id
	from tutorial, sessione, presentazione
	where presentazione.sessione=sessione.id_sessione and sessione.id_sessione= id_sessione and tutorial.id_tutorial=presentazione.id_presentazione);
END$$