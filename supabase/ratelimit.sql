create table rate_limits (key text primary key, window_start timestamptz not null default now(), hits int not null default 0);
alter table rate_limits enable row level security;

create function rate_limit_hit(p_key text, p_limit int, p_window int) returns boolean language plpgsql security definer set search_path = public as $$
declare v_hits int;
begin
  insert into rate_limits(key, window_start, hits) values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case when rate_limits.window_start < now() - make_interval(secs => p_window) then 1 else rate_limits.hits + 1 end,
    window_start = case when rate_limits.window_start < now() - make_interval(secs => p_window) then now() else rate_limits.window_start end
  returning hits into v_hits;
  return v_hits <= p_limit;
end $$;
revoke execute on function rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function rate_limit_hit(text, int, int) to service_role;
