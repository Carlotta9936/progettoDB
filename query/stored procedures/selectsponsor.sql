DELIMITER $$
CREATE PROCEDURE `selectsponsor`(in nomesponsor varchar(50))
BEGIN
	select *
    from sponsor
    where nome=nomesponsor;
END$$