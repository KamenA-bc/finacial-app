-- Add is_work_income column to income_entries table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

ALTER TABLE income_entries
ADD COLUMN is_work_income BOOLEAN NOT NULL DEFAULT false;
