-- Migration: course_access → multi-course (user_id, product)
-- Run in the Supabase SQL editor once the project is restored.
-- Safe now: no real customers to migrate (per TRANSITION-PLAN Phase 4).
--
-- Old shape: one row per user, column `tier` ('beginner'|'advanced')
-- New shape: one row per (user, product), product in ('agency','seo')

-- 1. Migrate any existing rows (beginner → agency; advanced → agency + seo)
alter table course_access add column if not exists product text;

update course_access set product = 'agency' where product is null;

insert into course_access (user_id, product)
select user_id, 'seo' from course_access
where tier = 'advanced'
on conflict do nothing;

-- 2. Enforce the composite key
alter table course_access drop constraint if exists course_access_user_id_key;
alter table course_access drop constraint if exists course_access_pkey;
alter table course_access alter column product set not null;
alter table course_access add constraint course_access_pkey primary key (user_id, product);
alter table course_access add constraint course_access_product_check
  check (product in ('agency', 'seo'));

-- 3. Drop the old tier column once the new webhook is deployed
alter table course_access drop column if exists tier;

-- 4. Retire the credits table (Studio is gone). Transactions stay.
drop table if exists credits;

-- 5. Wipe the old AI-influencer course content AFTER exporting it
--    (run archive/export-course-content.js first — see that file)
-- delete from course_content where key in ('structure', 'blocks');
