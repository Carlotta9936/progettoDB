DELIMITER $$
CREATE PROCEDURE `orariSessione` (in id int)
BEGIN
	select ora_f, ora_i
    from sessione
    where sessione.programma=id;
END$$