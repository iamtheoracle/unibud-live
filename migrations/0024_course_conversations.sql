alter table social_conversations
  add column if not exists course_code text;

create unique index if not exists social_conversations_course_unique
  on social_conversations(course_code)
  where kind = 'class' and course_code is not null;
