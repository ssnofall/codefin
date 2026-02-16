-- Auto-create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update scores on vote change
create trigger on_vote_change
  after insert or update or delete on votes
  for each row execute procedure update_post_score();


