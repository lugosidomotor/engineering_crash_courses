
  create view "webshop"."analytics_staging"."stg_events__dbt_tmp"
    
    
  as (
    select
  event_id,
  session_id,
  customer_id,
  event_type,
  sku,
  ts,
  date_trunc('day', ts)::date as event_date
from "webshop"."raw"."events"
  );