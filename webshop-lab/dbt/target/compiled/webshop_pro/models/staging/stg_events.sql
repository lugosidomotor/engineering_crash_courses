select
  event_id,
  session_id,
  customer_id,
  event_type,
  sku,
  ts,
  date_trunc('day', ts)::date as event_date
from "webshop"."raw"."events"