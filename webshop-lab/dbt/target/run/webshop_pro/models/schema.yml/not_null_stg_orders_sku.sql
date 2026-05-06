select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select sku
from "webshop"."analytics_staging"."stg_orders"
where sku is null



      
    ) dbt_internal_test