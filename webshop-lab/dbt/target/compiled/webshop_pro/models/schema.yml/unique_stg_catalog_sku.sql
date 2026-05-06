
    
    

select
    sku as unique_field,
    count(*) as n_records

from "webshop"."analytics_staging"."stg_catalog"
where sku is not null
group by sku
having count(*) > 1


