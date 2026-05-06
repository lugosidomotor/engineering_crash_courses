
  create view "webshop"."analytics_staging"."stg_orders__dbt_tmp"
    
    
  as (
    select
  order_id,
  customer_id,
  sku,
  qty,
  gross_amount,
  city,
  channel,
  status,
  ordered_at,
  date_trunc('day', ordered_at)::date as order_date
from "webshop"."raw"."orders"
  );