alter table orders add column payment_method text not null default 'cod', add column payment_status text not null default 'unpaid';
create table cart_items (user_id uuid not null default auth.uid() references profiles(id) on delete cascade, product_id uuid not null references products(id) on delete cascade, primary key (user_id, product_id));
alter table cart_items enable row level security;
create policy "own cart" on cart_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
