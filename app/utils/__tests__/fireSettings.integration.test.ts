/**
 * FIRE Settings Integration Tests
 * 
 * Purpose: Test Supabase database integration and RLS policies
 * Tests: CRUD operations, RLS policies, triggers
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

describe('FIRE Settings Integration Tests', () => {
  let supabase: SupabaseClient;
  let testUserId: string;

  beforeAll(async () => {
    // Create Supabase client
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Sign up test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: 'test-password-123',
    });

    if (authError || !authData.user) {
      throw new Error(`Failed to create test user: ${authError?.message}`);
    }

    testUserId = authData.user.id;
  });

  afterAll(async () => {
    // Clean up: delete test data
    if (testUserId) {
      await supabase.from('fire_settings').delete().eq('user_id', testUserId);
    }
  });

  describe('Table Structure', () => {
    test('fire_settings table exists', async () => {
      const { data, error } = await supabase
        .from('fire_settings')
        .select('*')
        .limit(1);

      // Should not error (table exists)
      expect(error).toBeNull();
    });
  });

  describe('RLS Policies - INSERT', () => {
    test('Can insert own fire settings', async () => {
      const { data, error } = await supabase
        .from('fire_settings')
        .insert({
          user_id: testUserId,
          investment_return_rate: 7.0,
          safe_withdrawal_rate: 4.0,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data?.user_id).toBe(testUserId);
      expect(data?.investment_return_rate).toBe(7);
      expect(data?.safe_withdrawal_rate).toBe(4);
    });

    test('Cannot insert settings for another user', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('fire_settings')
        .insert({
          user_id: fakeUserId,
          investment_return_rate: 5.0,
          safe_withdrawal_rate: 3.0,
        })
        .select();

      // Should fail due to RLS policy
      expect(error).toBeTruthy();
      expect(data).toBeNull();
    });
  });

  describe('RLS Policies - SELECT', () => {
    test('Can read own fire settings', async () => {
      const { data, error } = await supabase
        .from('fire_settings')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data?.user_id).toBe(testUserId);
    });

    test('Cannot read other users fire settings', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('fire_settings')
        .select('*')
        .eq('user_id', fakeUserId);

      // Should return empty array (no access)
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });
  });

  describe('RLS Policies - UPDATE', () => {
    test('Can update own fire settings', async () => {
      const { data, error } = await supabase
        .from('fire_settings')
        .update({ investment_return_rate: 8.0 })
        .eq('user_id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data?.investment_return_rate).toBe(8);
    });

    test('Cannot update other users fire settings', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('fire_settings')
        .update({ investment_return_rate: 10.0 })
        .eq('user_id', fakeUserId)
        .select();

      // Should fail or return empty (no access)
      expect(data).toEqual([]);
    });
  });

  describe('RLS Policies - DELETE', () => {
    test('Can delete own fire settings', async () => {
      // First, ensure we have a record
      await supabase
        .from('fire_settings')
        .upsert({
          user_id: testUserId,
          investment_return_rate: 7.0,
          safe_withdrawal_rate: 4.0,
        });

      // Delete it
      const { error } = await supabase
        .from('fire_settings')
        .delete()
        .eq('user_id', testUserId);

      expect(error).toBeNull();

      // Verify deleted
      const { data } = await supabase
        .from('fire_settings')
        .select('*')
        .eq('user_id', testUserId);

      expect(data).toEqual([]);
    });

    test('Cannot delete other users fire settings', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('fire_settings')
        .delete()
        .eq('user_id', fakeUserId)
        .select();

      // Should return empty (no access)
      expect(data).toEqual([]);
    });
  });

  describe('Triggers', () => {
    test('updated_at trigger updates timestamp on UPDATE', async () => {
      // Insert record
      const { data: insertData } = await supabase
        .from('fire_settings')
        .insert({
          user_id: testUserId,
          investment_return_rate: 7.0,
          safe_withdrawal_rate: 4.0,
        })
        .select()
        .single();

      const originalUpdatedAt = insertData?.updated_at;

      // Wait 100ms
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update record
      const { data: updateData } = await supabase
        .from('fire_settings')
        .update({ investment_return_rate: 8.0 })
        .eq('user_id', testUserId)
        .select()
        .single();

      const newUpdatedAt = updateData?.updated_at;

      // Timestamps should be different
      expect(newUpdatedAt).not.toBe(originalUpdatedAt);
      expect(new Date(newUpdatedAt!).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt!).getTime()
      );
    });
  });

  describe('Default Values', () => {
    test('Uses default values for investment_return_rate and safe_withdrawal_rate', async () => {
      // Delete existing
      await supabase.from('fire_settings').delete().eq('user_id', testUserId);

      // Insert without specifying rates
      const { data, error } = await supabase
        .from('fire_settings')
        .insert({ user_id: testUserId })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.investment_return_rate).toBe(7); // Default 7.0
      expect(data?.safe_withdrawal_rate).toBe(4); // Default 4.0
    });
  });

  describe('Unique Constraint', () => {
    test('Cannot insert duplicate user_id', async () => {
      // First insert
      await supabase.from('fire_settings').delete().eq('user_id', testUserId);
      await supabase
        .from('fire_settings')
        .insert({
          user_id: testUserId,
          investment_return_rate: 7.0,
        });

      // Second insert (should fail)
      const { data, error } = await supabase
        .from('fire_settings')
        .insert({
          user_id: testUserId,
          investment_return_rate: 8.0,
        });

      expect(error).toBeTruthy();
      expect(error?.code).toBe('23505'); // Unique violation
    });
  });
});
