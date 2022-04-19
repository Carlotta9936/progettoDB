DELIMITER $$
CREATE PROCEDURE `insertsponsorizzazione`(in importo float(8,2),in annoConf int,in acronimoConf varchar(10),in nome_sponsor varchar(50))
BEGIN
    INSERT INTO sponsorizzazione(importo, annoConf, acronimoConf, nome_sponsor) VALUES (importo, annoConf, acronimoConf, nome_sponsor);
END$$