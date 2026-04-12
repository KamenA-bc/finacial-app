-- Add description column to income_entries table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

ALTER TABLE income_entries
ADD COLUMN description TEXT NOT NULL DEFAULT '';
