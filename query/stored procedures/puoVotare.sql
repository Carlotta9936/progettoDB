DELIMITER $$
USE `confvirtual`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `puoVotare`(presentazione int)
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