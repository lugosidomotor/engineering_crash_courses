with paid_orders as (
  select *
  from {{ ref('stg_orders') }}
  where status = 'paid'
),

views as (
  select
    sku,
    count(distinct session_id) as product_view_sessions
  from {{ ref('stg_events') }}
  where event_type = 'product_view'
  group by 1
)

select
  catalog.sku,
  catalog.name,
  catalog.category,
  catalog.brand,
  catalog.stock,
  catalog.price,
  catalog.margin,
  coalesce(sum(paid_orders.gross_amount), 0) as paid_revenue,
  coalesce(sum(paid_orders.qty), 0) as paid_units,
  coalesce(max(views.product_view_sessions), 0) as product_view_sessions
from {{ ref('stg_catalog') }} as catalog
left join paid_orders on paid_orders.sku = catalog.sku
left join views on views.sku = catalog.sku
group by
  catalog.sku,
  catalog.name,
  catalog.category,
  catalog.brand,
  catalog.stock,
  catalog.price,
  catalog.margin
