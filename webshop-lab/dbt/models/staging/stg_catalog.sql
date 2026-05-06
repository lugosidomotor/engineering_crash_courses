select
  sku,
  name,
  category,
  brand,
  price,
  stock,
  rating,
  margin
from {{ source('raw', 'catalog') }}
