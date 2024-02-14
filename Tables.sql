Table users  {
  id int [pk, increment]
  first_name varchar
  last_name varchar
  email varchar
  is_admin boolean
  created_at timestamp
  country_code int
  phone_number varchar
  note: "table 'users' contains user information"
}

Table products  {
  id int [pk, increment]
  name varchar(255)
  created_by int [ref: > users.id]
  created_at datetime
}

Table offres  {
  id int [pk, increment, ref: < likes.id]
  product_id ind [ref: > products.id]
  author_id int
  description text [null]
  created_at datetime
}

Table likes  {
  id int [pk, increment]
  user_id ind [ref: - users.id]
  likeable_id int [ref: > groupes.id]
  likeable_type varchar
  is_like boolean
  description text [null]
  created_at datetime
}

Enum products_unity {
  KG
  L
  G
}

Table price_intervale  {
  id int [pk, increment]
  unity products_unity
  price double
  quantiy float
  purchase_by_one_person boolean [default: true]
}

Table groupes  {
  id int [pk, increment]
  offre_id int
  quantiy_product int
  author_id int [ref: > users.id]
  link string
  expired_at datetime
}


Table groupe_members  {
  id int [pk, increment]
  groupe_id int [ref: > groupes.id]
  user_id int [ref: - users.id]
  createdd_at datetime
}

Table product_quantity_groupe  {
  id int [pk, increment]
  groupe_id int [ref: > groupes.id]
  user_id int [ref: - users.id]
  quantiy float 
  reserved_at datetime
}

Table comptes  {
  id int [pk, ref: - groupes.id]
  groupe_id int
  is_ok boolean
  montant double
}

Table payments  {
  id int [pk, ref: > comptes.id]
  compte_id int
  user_id int
  montant double
  delivery_charges double
  payed_at datetime
}



Ref: "users"."id" < "offres"."author_id"

Ref: "offres"."id" < "price_intervale"."id"

Ref: "offres"."id" < "groupes"."id"
