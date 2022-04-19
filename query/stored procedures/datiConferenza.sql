DELIMITER $$
CREATE PROCEDURE `datiConferenza`(anno int, acronimo varchar(30))
BEGIN
	call specificaconferenza (anno, acronimo);
    call getAssociati (anno, acronimo);
    call getProgrammaGiornaliero (anno, acronimo);
    call getNumeroIscritti (anno, acronimo);
    call visualizzaSponsor (anno, acronimo);
END$$
