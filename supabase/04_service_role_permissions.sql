-- Grant table permissions to service_role
-- This allows the service role to bypass RLS and access all data during builds

-- Grant permissions on all tables
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;

-- Ensure future tables also get permissions
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

-- Grant specific table permissions (explicit for clarity)
grant select, insert, update, delete on table posts to service_role;
grant select, insert, update, delete on table profiles to service_role;
grant select, insert, update, delete on table votes to service_role;
grant select, insert, update, delete on table comments to service_role;

-- Verify grants (for debugging, can be removed in production)
do $$
begin
  raise notice 'Service role permissions granted successfully';
end $$;