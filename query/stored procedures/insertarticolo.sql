DELIMITER $$
CREATE PROCEDURE `insertarticolo`(in id_articolo int, in pdf varchar(70),in n_pagine int,in  titolo varchar(70))
BEGIN
	
    INSERT INTO articolo(id_articolo, pdf , stato,n_pagine, titolo) VALUES (id_articolo, pdf ,'non coperto',n_pagine, titolo);
END$$