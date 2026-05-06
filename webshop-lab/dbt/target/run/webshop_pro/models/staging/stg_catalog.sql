
  create view "webshop"."analytics_staging"."stg_catalog__dbt_tmp"
    
    
  as (
    select
  sku,
  name,
  category,
  brand,
  price,
  stock,
  rating,
  margin
from "webshop"."raw"."catalog"
  );