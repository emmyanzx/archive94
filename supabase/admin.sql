insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
create policy "admin uploads" on storage.objects for insert to authenticated with check (bucket_id = 'products' and public.is_admin());
create policy "admin updates files" on storage.objects for update to authenticated using (bucket_id = 'products' and public.is_admin());
create policy "admin deletes files" on storage.objects for delete to authenticated using (bucket_id = 'products' and public.is_admin());
-- Make yourself admin (use the Google account you sign in with):
update profiles set is_admin = true where email = 'uyamanny203@gmail.com';
