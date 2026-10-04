alter publication supabase_realtime add table cart_items;
alter table cart_items replica identity full;
