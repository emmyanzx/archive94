create table profiles (id uuid primary key references auth.users on delete cascade, email text, full_name text, is_admin boolean not null default false, created_at timestamptz default now());
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles(id,email,full_name) values (new.id,new.email,new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create table products (id uuid primary key default gen_random_uuid(), catalog_no int generated always as identity, name text not null, description text, price int not null check (price >= 0),
  category text, era text, size text, condition text, measurements jsonb, images text[] default '{}', stock int not null default 1 check (stock >= 0), created_at timestamptz default now());
create table orders (id uuid primary key default gen_random_uuid(), number text unique not null, user_id uuid not null references profiles(id), name text, phone text, address text, notes text,
  total int not null, status text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered')), created_at timestamptz default now());
create table order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references orders(id) on delete cascade, product_id uuid references products(id), name text, size text, price int);
create index on orders(user_id); create index on order_items(order_id);

alter table profiles enable row level security; alter table products enable row level security; alter table orders enable row level security; alter table order_items enable row level security;
create function is_admin() returns boolean language sql security definer set search_path = public stable as $$ select coalesce((select is_admin from profiles where id = auth.uid()), false) $$;
create policy "own profile" on profiles for select using (id = auth.uid());
create policy "read products" on products for select using (true);
create policy "admin writes products" on products for all using (is_admin()) with check (is_admin());
create policy "own orders" on orders for select using (user_id = auth.uid() or is_admin());
create policy "admin updates orders" on orders for update using (is_admin());
create policy "own order items" on order_items for select using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin())));

create function place_order(p_ids uuid[], p_name text, p_phone text, p_address text, p_notes text) returns json language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_order uuid; v_no text; v_total int; v_n int; v_items json; v_ids uuid[];
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  select array_agg(distinct x) into v_ids from unnest(p_ids) x;
  update products set stock = stock - 1 where id = any(v_ids) and stock > 0;
  get diagnostics v_n = row_count;
  if v_ids is null or v_n <> cardinality(v_ids) then raise exception 'sold_out'; end if;
  select sum(price) into v_total from products where id = any(v_ids);
  v_no := 'A94-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  insert into orders(number,user_id,name,phone,address,notes,total) values (v_no,v_user,p_name,p_phone,p_address,p_notes,v_total) returning id into v_order;
  insert into order_items(order_id,product_id,name,size,price) select v_order,id,name,size,price from products where id = any(v_ids);
  select json_agg(json_build_object('name',name,'size',size,'price',price)) into v_items from order_items where order_id = v_order;
  return json_build_object('number',v_no,'total',v_total,'items',v_items);
end $$;
revoke execute on function place_order(uuid[],text,text,text,text) from public, anon;
grant execute on function place_order(uuid[],text,text,text,text) to authenticated;
