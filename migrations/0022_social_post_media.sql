alter table posts add column if not exists video text;
alter table posts add column if not exists kind text not null default 'post';
