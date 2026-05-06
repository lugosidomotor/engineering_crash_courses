
  
    

  create  table "webshop"."analytics_marts"."mart_customer_features__dbt_tmp"
  
  
    as
  
  (
    select
  customer_id,
  count(*) filter (where status = 'paid') as paid_order_count,
  coalesce(sum(gross_amount) filter (where status = 'paid'), 0) as lifetime_value,
  max(ordered_at) as last_order_at
from "webshop"."analytics_staging"."stg_orders"
group by 1
  );
  