create or replace function get_player_data_by_id(IN integer)
 returns table(name varchar, email varchar)
as
$$
  	SELECT name, email FROM "public"."players"
	WHERE id = $1
$$
language sql;

create or replace function get_boss_data_by_id(IN integer)
 returns table(name varchar, damage integer, blood integer)
as
$$
  	SELECT name, damage, blood FROM "public"."bosses"
	WHERE id = $1
$$
language sql;