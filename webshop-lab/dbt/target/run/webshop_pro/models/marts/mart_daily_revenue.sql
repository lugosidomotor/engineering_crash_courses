
  
    

  create  table "webshop"."analytics_marts"."mart_daily_revenue__dbt_tmp"
  
  
    as
  
  (
    select
  order_date,
  channel,
  count(*) filter (where status = 'paid') as paid_orders,
  sum(gross_amount) filter (where status = 'paid') as paid_revenue,
  round(avg(gross_amount) filter (where status = 'paid')) as avg_order_value
from "webshop"."analytics_staging"."stg_orders"
group by 1, 2
  );
  