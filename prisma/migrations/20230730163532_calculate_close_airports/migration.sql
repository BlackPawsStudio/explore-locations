create or replace function get_close_regions_size(region_id int)
returns int
language plpgsql
as
$$
declare
    airports_in_region integer[];
    domestic_airports_count integer;
    international_airports_count integer;
begin

    airports_in_region := Array(WITH RECURSIVE child_region AS (
        SELECT id, "IdParent", "Name", "Type"
        FROM   "Regions"
        WHERE id = region_id
     
        UNION  ALL
        SELECT r.id, r."IdParent", r."Name", r."Type"
        FROM   "Regions" r
        INNER   JOIN child_region as cr ON r."IdParent" = cr.id
    )
    SELECT a.id 
    from child_region
    inner join "Airports" a 
    on a."RegionId" = child_region.id);
    
    domestic_airports_count := (select count(*)
    from (
        select * 
        from "Airports" a 
        where a.id = ANY(airports_in_region) and
            a."Type" = 'domestic' and
            ST_DWithin((select "Center" from "Regions" where id = region_id), a."Center", 200000)
        limit 5
        ) a
    );

    international_airports_count := (select count(*)
    from
    (select * 
    from "Airports" a 
    where a.id = ANY(airports_in_region) and
        a."Type" = 'international' and
        ST_DWithin((select "Center" from "Regions" where id = region_id), a."Center", 200000)
    limit 5
    ) a);
 
    return array_length(airports_in_region, 1) + domestic_airports_count + international_airports_count; 
  
end;
$$;


-- CreateTable
CREATE TABLE "CloseAirportsToRegions" (
    "id" INTEGER NOT NULL,
    "closeAirportsCount" INTEGER NOT NULL,

    CONSTRAINT "CloseAirportsToRegions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CloseAirportsToRegions" ADD CONSTRAINT "CloseAirportsToRegions_id_fkey" FOREIGN KEY ("id") REFERENCES "Regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
