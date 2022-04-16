CREATE  OR REPLACE VIEW `PresenterESpeaker` AS
	(SELECT * 
	FROM speaker
	) union (
	select *
	FROM presenter);
