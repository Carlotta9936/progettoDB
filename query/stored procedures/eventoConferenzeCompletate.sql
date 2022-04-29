drop event conferenzeCompletate; 
set global event_scheduler = ON;
CREATE EVENT conferenzeCompletate   
  ON SCHEDULE
    EVERY '1' DAY
    STARTS '2022-04-01 00:00:01'
  DO
	#SET SQL_SAFE_UPDATES = 0;
	update conferenza set svolgimento = "Completata" where datafine < curdate();
